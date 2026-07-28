from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ("Full Time", "Full Time"),
        ("Part Time", "Part Time"),
        ("Internship", "Internship"),
        ("Contract", "Contract"),
        ("Remote", "Remote"),
    )

    CURRENCY_CHOICES = (
        ("USD", "$ USD"),
        ("EUR", "€ EUR"),
        ("GBP", "£ GBP"),
        ("INR", "₹ INR"),
        ("CAD", "C$ CAD"),
        ("AUD", "A$ AUD"),
        ("SGD", "S$ SGD"),
    )

    Posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    Title = models.CharField(max_length=100)
    Company_name = models.CharField(max_length=100)
    Location = models.CharField(max_length=100)
    Salary = models.IntegerField(help_text="Annual salary")
    Currency = models.CharField(choices=CURRENCY_CHOICES, default="USD", max_length=10)
    Job_type = models.CharField(choices=JOB_TYPE_CHOICES, default="Full Time", max_length=50)
    Experience = models.CharField(max_length=50)
    Description = models.TextField(max_length=3000)
    skills_required = models.CharField(max_length=255, blank=True, default='')
    is_active = models.BooleanField(default=True)
    Created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-Created_at']

    def __str__(self):
        return f"{self.Title} at {self.Company_name}"


class Application(models.Model):
    STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Reviewing', 'Reviewing'),
        ('Shortlisted', 'Shortlisted'),
        ('Rejected', 'Rejected'),
        ('Hired', 'Hired'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(max_length=1000, blank=True, default='')
    resume = models.FileField(upload_to='application_resumes/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Applied')
    Applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')
        ordering = ['-Applied_at']

    def __str__(self):
        return f"{self.user.username} -> {self.job.Title} ({self.status})"