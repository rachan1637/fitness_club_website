import django
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "PB.settings")
django.setup()

import datetime
from dateutil.relativedelta import relativedelta
from Subscriptions.models import UserSubscription, Payment
from django.contrib.auth.models import User
import argparse

def change_valid_date(new_valid_date, username):
    user = User.objects.get(username=username)
    print(user.username)
    user_subscription = UserSubscription.objects.get(user=user)
    user_subscription.valid_date = new_valid_date
    user_subscription.cancelled = True
    user_subscription.save()
    user.save()

def make_payment(date_of_today: datetime.datetime):
    users_to_pay = UserSubscription.objects.filter(valid_date=date_of_today, cancelled=False)

    for user_sub in users_to_pay:
        # if not user_sub.cancelled:
        # Update unpaid ori future payment
        print(user_sub.user.username)
        print(user_sub)
        unpaid_payment = Payment.objects.get(
            user = user_sub.user,
            paid = False
        )
        unpaid_payment.paid = True
        unpaid_payment.save()

        # Update user account valid_date
        user_sub.valid_date = date_of_today + relativedelta(months=user_sub.plan.month_length)
        user_sub.save()

        # Create future payment
        Payment.objects.create(
            user = user_sub.user,
            amount = user_sub.plan.price,
            plan_month_length = user_sub.plan.month_length,
            paid_card_number = user_sub.card_number,
            paid_at = user_sub.valid_date,
            paid = False,
        )

        print("success")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--year", type=int, required=True)
    parser.add_argument("--month", type=int, required=True)
    parser.add_argument("--day", type=int, required=True)
    parser.add_argument("--username", type=str)
    parser.add_argument("--make_payment", type=bool)
    
    args = parser.parse_args()

    if args.make_payment:
        make_payment(datetime.datetime(args.year, args.month, args.day)) 
    else:
        change_valid_date(datetime.datetime(args.year, args.month, args.day), args.username)