from rest_framework import serializers
from jobs.models import Job, Application
from accounts.serializers import UserSerializer, ProfileSerializer

class JobSerializer(serializers.ModelSerializer):
    posted_by_username = serializers.CharField(source='Posted_by.username', read_only=True)
    posted_by_email = serializers.CharField(source='Posted_by.email', read_only=True)
    company_logo = serializers.SerializerMethodField()
    applicant_count = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    currency_symbol = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id',
            'Posted_by',
            'posted_by_username',
            'posted_by_email',
            'Title',
            'Company_name',
            'company_logo',
            'Location',
            'Salary',
            'Currency',
            'currency_symbol',
            'Job_type',
            'Experience',
            'Description',
            'skills_required',
            'is_active',
            'Created_at',
            'applicant_count',
            'has_applied',
        ]
        read_only_fields = ['Posted_by', 'Created_at']

    def get_currency_symbol(self, obj):
        symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'INR': '₹',
            'CAD': 'C$',
            'AUD': 'A$',
            'SGD': 'S$',
        }
        return symbols.get(obj.Currency, '$')

    def get_company_logo(self, obj):
        request = self.context.get('request')
        if hasattr(obj.Posted_by, 'profile') and obj.Posted_by.profile.company_logo:
            if request:
                return request.build_absolute_uri(obj.Posted_by.profile.company_logo.url)
            return obj.Posted_by.profile.company_logo.url
        return None

    def get_applicant_count(self, obj):
        return obj.applications.count()

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.applications.filter(user=request.user).exists()
        return False


class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    applicant_name = serializers.SerializerMethodField()
    applicant_email = serializers.CharField(source='user.email', read_only=True)
    applicant_phone = serializers.SerializerMethodField()
    applicant_resume = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_details',
            'user',
            'applicant_name',
            'applicant_email',
            'applicant_phone',
            'applicant_resume',
            'cover_letter',
            'resume',
            'status',
            'Applied_at',
        ]
        read_only_fields = ['user', 'Applied_at']

    def get_applicant_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name if full_name else obj.user.username

    def get_applicant_phone(self, obj):
        if hasattr(obj.user, 'profile'):
            return obj.user.profile.Phone
        return None

    def get_applicant_resume(self, obj):
        request = self.context.get('request')
        # Use application-specific resume or fallback to user profile resume
        resume_file = obj.resume or (obj.user.profile.resume if hasattr(obj.user, 'profile') else None)
        if resume_file:
            if request:
                return request.build_absolute_uri(resume_file.url)
            return resume_file.url
        return None
