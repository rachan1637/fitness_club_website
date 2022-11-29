from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import SubscriptionPlan, UserSubscription, Payment
from .serializers import (
    SubscriptionPlanSerializer, 
    CreateUserSubscriptionSerializer,
    UpdateCardInfoSerializer,
    UpdateSubscriptionPlanSerilizer,
    CancelSubscriptionSerializer,
    PaymentSerializer,
    ReactivateCancelledSubscriptionSerializer,
    UserSubscriptionSerializer,
)

class PaymentHistoryView(generics.ListAPIView):
    model = Payment.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

class ReactivateSubscriptionView(generics.UpdateAPIView):
    queryset = UserSubscription.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ReactivateCancelledSubscriptionSerializer

    def get_object(self):
        return UserSubscription.objects.filter(id=self.request.user.id)[0]

class CancelSubscriptionView(generics.UpdateAPIView):
    queryset = UserSubscription.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = CancelSubscriptionSerializer
    # lookup_field = "pk"

    def get_object(self):
        return UserSubscription.objects.filter(id=self.request.user.id)[0]

# Create your views here.
class UpdateCardInfoView(generics.UpdateAPIView):
    queryset = UserSubscription.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = UpdateCardInfoSerializer

    def get_object(self):
        return UserSubscription.objects.filter(id=self.request.user.id)[0]

class UpdateSubscriptionPlanView(generics.UpdateAPIView):
    queryset = UserSubscription.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = UpdateSubscriptionPlanSerilizer

    def get_object(self):
        return UserSubscription.objects.filter(id=self.request.user.id)[0]

class UserSubscriptionView(generics.RetrieveAPIView):
    queryset = UserSubscription.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = UserSubscriptionSerializer

    def get_object(self):
        return UserSubscription.objects.filter(id=self.request.user.id)[0]

class UserSubscribeView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = CreateUserSubscriptionSerializer

class AllSubscriptionview(generics.ListAPIView):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer