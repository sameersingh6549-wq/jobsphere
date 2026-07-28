from accounts.models import Profile


def user_profile(request):
    profile = None
    if request.user.is_authenticated:
        profile = Profile.objects.filter(user=request.user).first()
    return {"user_profile": profile}
