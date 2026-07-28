from rest_framework import generics, status, permissions, filters, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from jobs.models import Job, Application
from jobs.serializers import JobSerializer, ApplicationSerializer
from accounts.permissions import IsRecruiter, IsCandidate, IsOwnerOrReadOnly
from accounts.emails import send_application_confirmation_email, send_recruiter_applicant_alert_email

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class JobListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: List active jobs with search, multi-filter, sorting, and pagination.
    POST: Create a new job posting (Recruiter only).
    """
    serializer_class = JobSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsRecruiter()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        # Database Query Optimization: Avoid N+1 queries using select_related & prefetch_related
        queryset = Job.objects.filter(is_active=True).select_related('Posted_by', 'Posted_by__profile').prefetch_related('applications')

        # 1. Search Query (q)
        q = self.request.query_params.get('q', None)
        if q:
            queryset = queryset.filter(
                Q(Title__icontains=q) |
                Q(Company_name__icontains=q) |
                Q(Description__icontains=q) |
                Q(skills_required__icontains=q)
            )

        # 2. Filter by Job Type
        job_type = self.request.query_params.get('job_type', None)
        if job_type:
            queryset = queryset.filter(Job_type__iexact=job_type)

        # 3. Filter by Location
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(Location__icontains=location)

        # 4. Filter by Salary Range
        min_salary = self.request.query_params.get('min_salary', None)
        max_salary = self.request.query_params.get('max_salary', None)
        if min_salary:
            queryset = queryset.filter(Salary__gte=min_salary)
        if max_salary:
            queryset = queryset.filter(Salary__lte=max_salary)

        # 5. Sorting / Ordering
        ordering = self.request.query_params.get('ordering', '-Created_at')
        if ordering in ['Created_at', '-Created_at', 'Salary', '-Salary']:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        # Automatically assign company name from recruiter profile if available
        company_name = self.request.data.get('Company_name')
        if not company_name and hasattr(self.request.user, 'profile'):
            company_name = self.request.user.profile.company_name or self.request.user.username

        serializer.save(Posted_by=self.request.user, Company_name=company_name)


class JobDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve job details.
    PUT/PATCH: Update job posting (Owner Recruiter only).
    DELETE: Soft-deactivate or delete job posting (Owner Recruiter only).
    """
    queryset = Job.objects.all().select_related('Posted_by', 'Posted_by__profile')
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsRecruiter(), IsOwnerOrReadOnly()]
        return [permissions.AllowAny()]


class RecruiterPostedJobsAPIView(generics.ListAPIView):
    """
    GET: List jobs posted by currently logged in recruiter.
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Job.objects.filter(Posted_by=self.request.user).select_related('Posted_by', 'Posted_by__profile')


class ApplyJobAPIView(APIView):
    """
    POST: Candidate apply to a job posting with resume file upload.
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidate]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, is_active=True)
        except Job.DoesNotExist:
            return Response({"error": "Job position not found or inactive."}, status=status.HTTP_404_NOT_FOUND)

        if Application.objects.filter(user=request.user, job=job).exists():
            return Response({"error": "You have already applied to this job position."}, status=status.HTTP_400_BAD_REQUEST)

        cover_letter = request.data.get('cover_letter', '')
        resume_file = request.FILES.get('resume', None)

        # Fallback to user profile resume if file not directly attached in request
        if not resume_file and hasattr(request.user, 'profile') and request.user.profile.resume:
            resume_file = request.user.profile.resume

        if not resume_file:
            return Response({"error": "A resume is required to apply. Please upload a resume file."}, status=status.HTTP_400_BAD_REQUEST)

        application = Application.objects.create(
            user=request.user,
            job=job,
            cover_letter=cover_letter,
            resume=resume_file,
            status='Applied'
        )

        # Trigger async email notifications
        send_application_confirmation_email(request.user, job)
        if job.Posted_by and job.Posted_by.email:
            send_recruiter_applicant_alert_email(job.Posted_by, request.user, job)

        serializer = ApplicationSerializer(application, context={'request': request})
        return Response({
            "message": "Application submitted successfully!",
            "application": serializer.data
        }, status=status.HTTP_201_CREATED)


class CandidateApplicationsAPIView(generics.ListAPIView):
    """
    GET: List all applications submitted by currently logged in candidate.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user).select_related('job', 'job__Posted_by', 'job__Posted_by__profile')


class RecruiterJobApplicantsAPIView(generics.ListAPIView):
    """
    GET: List applicants for a specific job posted by logged in recruiter.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        return Application.objects.filter(job__id=job_id, job__Posted_by=self.request.user).select_related('user', 'user__profile', 'job')


class UpdateApplicationStatusAPIView(APIView):
    """
    PATCH: Recruiter update application status (Applied, Reviewing, Shortlisted, Rejected, Hired).
    """
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def patch(self, request, pk):
        try:
            app = Application.objects.get(id=pk, job__Posted_by=request.user)
        except Application.DoesNotExist:
            return Response({"error": "Application record not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired']:
            return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)

        app.status = new_status
        app.save()

        serializer = ApplicationSerializer(app, context={'request': request})
        return Response({
            "message": f"Application status updated to '{new_status}' successfully.",
            "application": serializer.data
        }, status=status.HTTP_200_OK)
