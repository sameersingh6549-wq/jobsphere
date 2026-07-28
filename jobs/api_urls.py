from django.urls import path
from jobs.api_views import (
    JobListCreateAPIView,
    JobDetailAPIView,
    RecruiterPostedJobsAPIView,
    ApplyJobAPIView,
    CandidateApplicationsAPIView,
    RecruiterJobApplicantsAPIView,
    UpdateApplicationStatusAPIView,
)

urlpatterns = [
    path('', JobListCreateAPIView.as_view(), name='api_job_list_create'),
    path('<int:pk>/', JobDetailAPIView.as_view(), name='api_job_detail'),
    path('<int:job_id>/apply/', ApplyJobAPIView.as_view(), name='api_job_apply'),
    path('my-posted-jobs/', RecruiterPostedJobsAPIView.as_view(), name='api_my_posted_jobs'),
    path('my-applications/', CandidateApplicationsAPIView.as_view(), name='api_my_applications'),
    path('<int:job_id>/applicants/', RecruiterJobApplicantsAPIView.as_view(), name='api_job_applicants'),
    path('applications/<int:pk>/status/', UpdateApplicationStatusAPIView.as_view(), name='api_update_application_status'),
]
