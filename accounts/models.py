from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    ROLE_CHOICES = (
        ('Recruiter', 'Recruiter'),
        ('Candidate', 'Candidate'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    Phone = models.CharField(max_length=20, blank=True, null=True)
    Profile_photo = models.ImageField(upload_to='profile_photo/', blank=True, null=True)
    Bio = models.TextField(max_length=500, blank=True, default='')
    Role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Candidate')

    # Candidate specific fields
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    skills = models.CharField(max_length=255, blank=True, default='')

    # Recruiter specific fields
    company_name = models.CharField(max_length=100, blank=True, default='')
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    company_website = models.URLField(max_length=200, blank=True, default='')

    def __str__(self):
        return f"{self.user.username}'s Profile ({self.Role})"

# Django Signal for auto-profile creation
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()

