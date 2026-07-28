from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from accounts.models import Profile

def signup(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method=='POST':
        username=request.POST.get("username")
        first_name=request.POST.get("first_name")
        last_name=request.POST.get("last_name")
        email=request.POST.get("email")
        password=request.POST.get("password")
        confirm_password=request.POST.get("confirm_password")
        if not username or not email or not first_name or not last_name or not password or not confirm_password:
            messages.warning(request,"Please fill all fields.")
            return render(request,"accounts/signup.html")
        if password==confirm_password :
            if User.objects.filter(username=username).exists():
                messages.warning(request,"Username already exists.")
                return render(request,"accounts/signup.html")
            if User.objects.filter(email=email).exists():
                messages.warning(request,"Email already exists.")
                return render(request,"accounts/signup.html")
            User.objects.create_user(
                        username=username,
                         first_name=first_name,
                        last_name=last_name,
                        email=email,
                        password=password
                    )
            messages.success(request,"Signup completed successfully.")
            return redirect("login")
        else :
            messages.warning(request,"Passwords do not match.")
        
    return render(request, "accounts/signup.html")
def user_login(request):
    if request.user.is_authenticated:
        return redirect("/")
    if request.method=='POST':
        username=request.POST.get("username")
        password=request.POST.get("password")
        if not username or not password :
            messages.warning(request,"Please fill all fields.")
            return render(request,"accounts/login.html")
        user=authenticate(
                username=username,
                password=password
           )
        if user is None :
            messages.warning(request,"Invalid username or password.")
            return render(request,"accounts/login.html")
            
        login(request,user)
        messages.success(request,"Login successful.")
        return redirect("home")
    return render(request,"accounts/login.html")
@login_required
def user_logout(request):
    logout(request)
    messages.success(request,"Logout successful.")
    return redirect("login")
@login_required 
def profile(request):
    if request.method=='POST':
         if Profile.objects.filter(user=request.user).exists():
            profile=Profile.objects.get(user=request.user)
            phone=request.POST.get("phone")
            profile.Phone=phone
            profile_photo=request.FILES.get("profile_photo")
            if profile_photo:
                profile.Profile_photo=profile_photo
            bio=request.POST.get("bio")
            profile.Bio=bio
            role=request.POST.get("role")
            if role:
                profile.Role=role
            profile.save()
            messages.success(request,"Profile updated successfully.")
            return render(request,"accounts/profile.html",{"profile":profile})
         phone=request.POST.get("phone")  
         profile_photo=request.FILES.get("profile_photo")
         bio=request.POST.get("bio") 
         role=request.POST.get("role")
         Profile.objects.create(
             user=request.user,
             Phone=phone,
             Profile_photo=profile_photo,
             Bio=bio,
             Role=role or 'Candidate',
         )
         profile=Profile.objects.filter(user=request.user).first()
         messages.success(request,"Profile created successfully.")
         return render(request,"accounts/profile.html",{"profile":profile})
    profile=Profile.objects.filter(user=request.user).first()
    return render(request,"accounts/profile.html",{"profile":profile})