from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from .models import Profile
from phonenumber_field.modelfields import PhoneNumberField
from rest_framework.exceptions import PermissionDenied
from rest_framework import status


# Reference: https://medium.com/django-rest/django-rest-framework-login-and-register-user-fd91cf6029d5
# Reference: https://medium.com/django-rest/django-rest-framework-change-password-and-update-profile-1db0c144c0a3

class MyCustomExcpetion(PermissionDenied):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Custom Exception Message"
    default_code = 'invalid'

    def __init__(self, detail, status_code=None):
        self.detail = detail
        if status_code is not None:
            self.status_code = status_code

class UserSearializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSearializer(read_only=True)
    class Meta:
        model = Profile
        fields = ("user", 'first_name', 'last_name', 'email', "avatar", "phone_number")

class UpdateUserProfileSerializer(serializers.ModelSerializer):
    # phone_number = PhoneNumberField(blank=True)
    class Meta:
        model = Profile
        fields = ("first_name", "last_name", "email", "avatar", "phone_number")

    def update(self, instance, validated_data):
        # if validated_data is not None:
        if validated_data.get("first_name", "") != "":
            instance.profile.first_name = validated_data["first_name"]

        if validated_data.get("last_name", "") != "":
            instance.profile.last_name = validated_data["last_name"]

        if validated_data.get("email", "") != "":
            instance.profile.email = validated_data["email"]

        if validated_data.get("avatar", "") != "":
            print(validated_data["avatar"])
            instance.profile.avatar = validated_data["avatar"]
            print(instance.profile.avatar)
        
        if validated_data.get("phone_number", "") != "":
            instance.profile.phone_number = validated_data["phone_number"]

        instance.profile.save()
        print(instance.profile.avatar)
            
        return super().update(instance, validated_data)

    # def partial_update(self, instance, validated_data):
    #     return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': _('The user is not registered or the password is incorrect!')
    }
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        print(user.username)
        print(user.id)
        print(token)
        return token


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {'username': {'required': True}, 'password': {'required': True}, 'password2': {'required': True}} 

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
            # raise MyCustomExcpetion(detail={""})

        return attrs

    # def validate_email(self, value):
    #     user = self.context['request'].user
    #     if User.objects.exclude(pk=user.pk).filter(email=value).exists():
    #         raise serializers.ValidationError({"email": "This email is already in use."})
    #     return value

    def create(self, validated_data):
        email = validated_data.get("email", "")
        user = User.objects.create(
            username=validated_data['username'],
            email=email,
            first_name=validated_data.get('first_name', ""),
            last_name=validated_data.get('last_name', "")
        )
        
        user.set_password(validated_data['password'])
        user.save()

        return user