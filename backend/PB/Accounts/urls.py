from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import (
    RegisterView, 
    MyObtainTokenPairView, 
    LogoutView,
    ChangePasswordView,
    UpdateUserView,
    # ProfileViewSet,
    UserProfileView,
)

# user_profile = ProfileViewSet.as_view({'get': 'retrieve'})

urlpatterns = [
    path('register/', RegisterView.as_view(), name="account_register"),
    path('login/', TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='token_logout'),
    path('change_password/', ChangePasswordView.as_view(), name='account_change_password'),
    path('update_profile/', UpdateUserView.as_view(), name='account_update_profile'),
    path('view_profile/', UserProfileView.as_view(), name="profile_view"),
]
