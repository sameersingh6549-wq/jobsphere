from rest_framework import permissions

class IsRecruiter(permissions.BasePermission):
    """
    Allows access only to authenticated users with the Recruiter role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.Role == 'Recruiter'
        )

class IsCandidate(permissions.BasePermission):
    """
    Allows access only to authenticated users with the Candidate role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.Role == 'Candidate'
        )

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'Posted_by'):
            return obj.Posted_by == request.user
        return False
