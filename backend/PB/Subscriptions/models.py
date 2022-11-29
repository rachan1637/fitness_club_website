from django.db import models
from django.contrib.auth.models import User
from creditcards.models import CardNumberField, CardExpiryField, SecurityCodeField
from django.core.exceptions import ValidationError

def validate_positive(value):
    if value < 0.0:
        raise ValidationError("The price should be positive!")

# Create your models here.
class SubscriptionPlan(models.Model):
    month_length = models.PositiveIntegerField(blank=False)
    price = models.FloatField(blank=False, validators=[validate_positive])

class UserSubscription(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="sub_plan")
    plan = models.ForeignKey(SubscriptionPlan, null=True, on_delete=models.SET_NULL)   
    # Do we need to consider the case where one subscription date is changed or deleted?

    valid_date = models.DateField()
    # valid_date and next_payment should be created_date + plan.day_length
    # The reason for making two fields is just that it'll be easier to show in api end point.
    #   1. When a book activity happens, need to compare valid_date with the scheduled book date.

    cancelled = models.BooleanField()
    # set cancelled to True if a user cancel the subscription
    # if cancelled is True, then the future payment will be deleted.

    # We need a scheduled task to check at every 00:00 am, 
    # if the valid_date == current_date - 1 (yesterday) and cancelled == False -> 
    #   1. the valid_date should be updated by current_date + plan.day_length
    #   2. a new payment is created

    card_number = CardNumberField()
    card_expiry = CardExpiryField()
    card_security_code = SecurityCodeField()

class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    amount = models.FloatField(null=True)
    plan_month_length = models.PositiveIntegerField(blank=False)
    paid_card_number = CardNumberField(null=True)
    paid = models.BooleanField()
    paid_at = models.DateField(null=True)

