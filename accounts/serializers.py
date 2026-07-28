from rest_framework import serializers
from django.contrib.auth.models import User
from accounts.models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'Phone',
            'Profile_photo',
            'Bio',
            'Role',
            'resume',
            'skills',
            'company_name',
            'company_logo',
            'company_website'
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            if instance.Profile_photo:
                rep['Profile_photo'] = request.build_absolute_uri(instance.Profile_photo.url)
            if instance.company_logo:
                rep['company_logo'] = request.build_absolute_uri(instance.company_logo.url)
            if instance.resume:
                rep['resume'] = request.build_absolute_uri(instance.resume.url)
        return rep

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, default='Candidate', write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'confirm_password', 'role', 'phone']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email address already registered."})
        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role', 'Candidate')
        phone = validated_data.pop('phone', '')
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )

        # Profile is created via signal, update role and phone
        profile = user.profile
        profile.Role = role
        if phone:
            profile.Phone = phone
        profile.save()

        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims into payload
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        role = getattr(user.profile, 'Role', 'Candidate') if hasattr(user, 'profile') else 'Candidate'
        token['role'] = role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Include user details directly in response payload alongside access & refresh tokens
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': getattr(self.user.profile, 'Role', 'Candidate') if hasattr(self.user, 'profile') else 'Candidate'
        }
        return data