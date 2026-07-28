from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from jobs.models import Job,Application
from accounts.models import Profile
from django.contrib import messages
from django.contrib.auth.models import User
def home(request):
    return render(request,"jobs/home.html")
@login_required
def postjob(request):
    profile = Profile.objects.filter(user=request.user).first()
    if not profile or profile.Role != 'Recruiter':
        messages.warning(request, "Unauthorized access.")
        return redirect('job')
    if request.method=='POST':
        title=request.POST.get('title')
        company_name=request.POST.get('company_name')
        location=request.POST.get('location')
        salary=request.POST.get('salary')
        job_type=request.POST.get('job_type')
        experience=request.POST.get('experience')
        description=request.POST.get('description')
        Job.objects.create(
            Posted_by=request.user,
            Title=title,
            Company_name=company_name,
            Location=location,
            Salary=salary,
            Job_type=job_type,
            Experience=experience,
            Description=description,
            )
        messages.success(request, "Job created successfully.")
        return redirect('job')
    return render(request,"jobs/post_job.html")
def job(request):
    job=Job.objects.all()
    return render(request,'jobs/job.html',{'job':job})
def edit_job(request,id):
    job=Job.objects.get(id=id)
    profile = Profile.objects.filter(user=request.user).first()
    if job.Posted_by != request.user or not profile or profile.Role != 'Recruiter':
        messages.warning(request, "Unauthorized access.")
        return redirect('job')
    if request.method=='POST':
        job.Title=request.POST.get("title")
        job.Company_name=request.POST.get('company_name')
        job.Location=request.POST.get('location')
        job.Salary=request.POST.get('salary')
        job.Job_type=request.POST.get('job_type')
        job.Experience=request.POST.get('experience')
        job.Description=request.POST.get('description')
        job.save()
        messages.success(request, "Job updated successfully.")
        return redirect("job")
    return render(request,'jobs/post_job.html',{'job':job})
def delete_job(request,id):
    job=Job.objects.get(id=id)
    profile = Profile.objects.filter(user=request.user).first()
    if job.Posted_by != request.user or not profile or profile.Role != 'Recruiter':
        messages.warning(request, "Unauthorized access.")
        return redirect('job')
    job.delete()
    messages.success(request, "Job deleted successfully.")
    return redirect("job")
def application(request,id):
    job=Job.objects.get(id=id)
    if Application.objects.filter(user=request.user,job=job).exists():
        messages.warning(request,"Already applied.")
        return redirect('job')
    Application.objects.create(
        user=request.user,
        job=job,
        )   
    messages.success(request, "Application submitted successfully.")
    return redirect('job')
@login_required
def my_applications(request):
    profile = Profile.objects.filter(user=request.user).first()
    if not profile or profile.Role == 'Recruiter':
        messages.warning(request, "Unauthorized access.")
        return redirect('job')
    application=Application.objects.filter(user=request.user)
    return render(request,"jobs/my_application.html",{'application':application})
def applicants(request,id):
    job=Job.objects.get(id=id)
    applicants=Application.objects.filter(job=job)
    return render(request,'jobs/applicants.html',{'applicants':applicants})
def my_posted_jobs(request):
    profile = Profile.objects.filter(user=request.user).first()
    if not profile or profile.Role != 'Recruiter':
        messages.warning(request, "Unauthorized access.")
        return redirect('job')
    job=Job.objects.filter(Posted_by=request.user)
    return render(request,'jobs/my_posted_jobs.html',{'job':job})
@login_required
def dashboard(request):
    profile = Profile.objects.filter(user=request.user).first()
    if not profile or profile.Role != 'Recruiter':
        messages.warning(request, "Unauthorized access.")
        return redirect('job')
    job=Job.objects.filter(Posted_by=request.user)
    total_job_posted=job.count()
    applicants=Application.objects.filter(job__in=job)
    total_applicants=applicants.count()
    count=Application.objects.filter(user=request.user)
    total_application_made=count.count()
    image=profile
    return render(request,"jobs/dashboard.html",{
        'job': job,
        'total_job_posted': total_job_posted,
        'total_applicants': total_applicants,
        'total_application_made': total_application_made,
        'image': image,
    })