from django.urls import path
from .views import (
    AllSubscriptionview,
    UserSubscribeView,
    UpdateSubscriptionPlanView,
    UpdateCardInfoView,
    CancelSubscriptionView,
    PaymentHistoryView,
    ReactivateSubscriptionView,
    UserSubscriptionView
)

urlpatterns = [
    path('all_plans/', AllSubscriptionview.as_view(), name="all_plans"),
    path("subscribe/", UserSubscribeView.as_view(), name="subscribe"),
    path("update_plan/", UpdateSubscriptionPlanView.as_view(), name="update_sub_plan"),
    path("update_card_info/", UpdateCardInfoView.as_view(), name="update_card_info"),
    path("cancel_plan/", CancelSubscriptionView.as_view(), name="cancel_plan"),
    path("payment_history/", PaymentHistoryView.as_view(), name="payment_history"),
    path("reactivate_plan/", ReactivateSubscriptionView.as_view(), name="reactivate"),
    path("view_subscription/", UserSubscriptionView.as_view(), name="view_subscription")
]
