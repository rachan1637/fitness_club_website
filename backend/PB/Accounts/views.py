from django.contrib.auth.models import User
from django.shortcuts import redirect
from .serializers import (
    RegisterSerializer, 
    MyTokenObtainPairSerializer, 
    ChangePasswordSerializer,
    UpdateUserProfileSerializer,
    ProfileSerializer
)
from .models import Profile
from rest_framework import generics, status, viewsets, mixins
from rest_framework_simplejwt.tokens import RefreshToken, Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
# from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Reference: https://medium.com/django-rest/django-rest-framework-login-and-register-user-fd91cf6029d5
# Reference: https://medium.com/django-rest/django-rest-framework-change-password-and-update-profile-1db0c144c0a3
# Reference: https://medium.com/django-rest/logout-django-rest-framework-eb1b53ac6d35

class UpdateUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateUserProfileSerializer

    def get_object(self):
        return User.objects.filter(id=self.request.user.id)[0]

# class ProfileViewSet(viewsets.ModelViewSet):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer
#     permission_classes = [IsAuthenticated,]

#     def get_queryset(self):
#         if self.action == 'list':
#             return self.queryset.filter(user=self.request.user)
#         return self.queryset

class UserProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = ProfileSerializer

    def get_object(self):
        return Profile.objects.filter(id=self.request.user.id)[0]

class ChangePasswordView(generics.UpdateAPIView):
    """
    Change the password for the authenticated user.
    """
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return User.objects.filter(id=self.request.user.id)[0]


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

class LogoutView(APIView):
    """
    Blacklist the input refresh token to logout the user.
    Success -> Return Response 205
    Fail -> Return Response 400, which indicates the input token or token type is invalid.

    """
    permission_classes = (IsAuthenticated,)

    # @swagger_auto_schema(
    #     operation_description="description",
    #     response = {
    #         205: "Success",
    #         400: "Fail, the token type or token iteself is invalid"
    #     }
    # )
    def post(self, request):
        try:
            print(request.data)
            # if "refresh_token" in request.data:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response("Success", status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer