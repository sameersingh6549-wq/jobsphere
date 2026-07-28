import threading
import logging
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

logger = logging.getLogger(__name__)

def send_async_email(subject, text_content, html_content, recipient_list):
    """
    Sends an HTML formatted email in a background thread to prevent blocking HTTP API responses.
    """
    def _send():
        try:
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=recipient_list
            )
            if html_content:
                msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            logger.info(f"Email '{subject}' sent successfully to {recipient_list}")
        except Exception as e:
            logger.error(f"Failed to send email '{subject}' to {recipient_list}: {str(e)}")

    thread = threading.Thread(target=_send)
    thread.start()


def send_welcome_email(user):
    """
    Sends Welcome Email to newly registered user.
    """
    role = getattr(user.profile, 'Role', 'Candidate') if hasattr(user, 'profile') else 'Candidate'
    subject = f"Welcome to JobSphere, {user.first_name or user.username}! 🎉"
    
    text_content = f"Hi {user.username},\n\nWelcome to JobSphere! Your account as a {role} has been created successfully."
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; background-color: #090D16; color: #FFF; padding: 30px; border-radius: 12px;">
        <h2 style="color: #818CF8; margin-bottom: 10px;">Welcome to JobSphere!</h2>
        <p style="color: #D1D5DB; font-size: 15px; line-height: 1.6;">
            Hi <strong>{user.first_name or user.username}</strong>,
        </p>
        <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6;">
            Thank you for joining JobSphere as a <strong>{role}</strong>. We are thrilled to help you connect with top tech opportunities and talent worldwide.
        </p>
        <div style="margin-top: 25px;">
            <a href="http://localhost:5173/login" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: #FFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Explore Dashboard &rarr;
            </a>
        </div>
        <p style="color: #6B7280; font-size: 12px; margin-top: 30px;">
            If you did not create this account, please ignore this email.
        </p>
    </div>
    """
    
    send_async_email(subject, text_content, html_content, [user.email])


def send_application_confirmation_email(candidate_user, job):
    """
    Sends confirmation email to Candidate after applying to a job position.
    """
    subject = f"Application Received: {job.Title} at {job.Company_name}"
    
    text_content = f"Hi {candidate_user.username},\n\nYour application for {job.Title} at {job.Company_name} has been received successfully."
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; background-color: #090D16; color: #FFF; padding: 30px; border-radius: 12px;">
        <h2 style="color: #34D399; margin-bottom: 10px;">Application Submitted Successfully!</h2>
        <p style="color: #D1D5DB; font-size: 15px;">
            Hi <strong>{candidate_user.first_name or candidate_user.username}</strong>,
        </p>
        <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6;">
            Your application for <strong>{job.Title}</strong> at <strong>{job.Company_name}</strong> has been received. The recruiting team will review your profile shortly.
        </p>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <div style="color: #FFF; font-weight: bold;">{job.Title}</div>
            <div style="color: #9CA3AF; font-size: 13px;">{job.Company_name} • {job.Location}</div>
        </div>
        <a href="http://localhost:5173/dashboard" style="background: #374151; color: #FFF; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Track Application Status
        </a>
    </div>
    """
    
    send_async_email(subject, text_content, html_content, [candidate_user.email])


def send_recruiter_applicant_alert_email(recruiter_user, candidate_user, job):
    """
    Sends instant notification email to Recruiter when a new applicant submits an application.
    """
    subject = f"New Applicant for {job.Title}: {candidate_user.first_name or candidate_user.username}"
    
    text_content = f"Hi {recruiter_user.username},\n\nA new candidate ({candidate_user.email}) has applied for {job.Title}."
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; background-color: #090D16; color: #FFF; padding: 30px; border-radius: 12px;">
        <h2 style="color: #C084FC; margin-bottom: 10px;">New Job Applicant Alert! 🚀</h2>
        <p style="color: #D1D5DB; font-size: 15px;">
            Hi <strong>{recruiter_user.first_name or recruiter_user.username}</strong>,
        </p>
        <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6;">
            <strong>{candidate_user.first_name or candidate_user.username}</strong> ({candidate_user.email}) has just applied for your job opening: <strong>{job.Title}</strong>.
        </p>
        <div style="margin-top: 20px;">
            <a href="http://localhost:5173/dashboard" style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: #FFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Review Applicant &rarr;
            </a>
        </div>
    </div>
    """
    
    send_async_email(subject, text_content, html_content, [recruiter_user.email])
