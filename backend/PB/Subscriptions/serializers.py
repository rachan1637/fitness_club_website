from rest_framework import serializers
from .models import SubscriptionPlan, UserSubscription, Payment
import datetime
from dateutil.relativedelta import relativedelta

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ("id", 'month_length', 'price')

class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer()
    class Meta:
        model = UserSubscription
        fields = ("plan", "valid_date", "card_number", "cancelled")

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("amount", "plan_month_length", "paid_card_number", "paid_at", "paid")


class CancelSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubscription
        fields = ("cancelled", )
        # extra_kwargs = {'cancelled': {'required': True}} 

    def update(self, instance, validated_data):
        # Update 
        # if validated_data["cancelled"] == False:
        #     return instance

        instance.cancelled = True
        instance.save()

        # Cancel future payment
        future_payment = Payment.objects.get(
            user = self.context["request"].user,
            paid = False,
        )
        future_payment.delete()

        return instance

class UpdateCardInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubscription
        fields = ("card_number", "card_expiry", "card_security_code", )
    
    def update(self, instance, validated_data):
        print(instance.card_number)
        # Update user subscription profile card info
        instance.card_number = validated_data["card_number"]
        instance.card_expiry = validated_data["card_expiry"]
        instance.card_security_code = validated_data["card_security_code"]
        instance.save()
        print(instance.card_number)

        # Update future payment card info
        future_payment = Payment.objects.get(
            user = self.context["request"].user,
            paid = False,
        )

        future_payment.paid_card_number = instance.card_number
        future_payment.save()

        return instance
        

class UpdateSubscriptionPlanSerilizer(serializers.ModelSerializer):
    plan_code = serializers.IntegerField(required=True, write_only=True)
    class Meta:
        model = UserSubscription
        fields = ("plan_code", )

    def validate(self, attrs):
        if not SubscriptionPlan.objects.filter(pk=attrs["plan_code"]).exists():
            raise serializers.ValidationError({"plan": "This subscription plan doesn't exist."})

        return attrs

    def update(self, instance, validated_data):
        print(instance)
        # Get new plan
        new_plan = SubscriptionPlan.objects.get(pk=validated_data["plan_code"])

        # Update subscription
        instance.plan = new_plan
        instance.save()

        print(instance.plan)
        validated_data.pop("plan_code")

        # Get the future payment
        future_payment = Payment.objects.get(
            user = self.context["request"].user,
            paid = False,
        )

        # Update Future Payment
        future_payment.amount = instance.plan.price
        future_payment.plan_month_length = instance.plan.month_length
        future_payment.save()
            
        return instance


class ReactivateCancelledSubscriptionSerializer(serializers.ModelSerializer):
    plan_code = serializers.IntegerField(required=True, write_only=True)
    class Meta:
        model = UserSubscription
        fields = ("plan_code", "card_number", "card_expiry", "card_security_code")

    def update(self, instance, validated_data):
        # Update 
        # if validated_data["cancelled"] == True:
        #     return instance

        today = datetime.date.today()
        plan = SubscriptionPlan.objects.get(pk=validated_data["plan_code"])

        if today > instance.valid_date:
            # first payment
            Payment.objects.create(
                user = instance.user,
                amount = plan.price,
                plan_month_length = plan.month_length,
                paid_card_number = validated_data["card_number"],
                paid_at = today,
                paid = True,
            )
            instance.valid_date = today + relativedelta(months=plan.month_length)

        # Future payment
        Payment.objects.create(
            user = instance.user,
            amount = plan.price,
            plan_month_length = plan.month_length,
            paid_card_number = validated_data["card_number"],
            paid_at = instance.valid_date,
            paid = False,
        )

        instance.plan = plan
        instance.cancelled = False
        instance.card_number = validated_data["card_number"]
        instance.card_expiry = validated_data["card_expiry"]
        instance.card_security_code = validated_data["card_security_code"]
        instance.save()

        return instance

class CreateUserSubscriptionSerializer(serializers.ModelSerializer):
    plan_code = serializers.IntegerField(required=True, write_only=True)

    class Meta:
        model = UserSubscription
        fields = ("plan_code", "card_number", "card_expiry", "card_security_code")

    def validate(self, attrs):
        if not SubscriptionPlan.objects.filter(pk=attrs["plan_code"]).exists():
            raise serializers.ValidationError({"plan": "This subscription plan doesn't exist."})

        return attrs
    
    def create(self, validated_data):
        user = self.context["request"].user
        plan = SubscriptionPlan.objects.get(pk=validated_data["plan_code"])
        validated_data.pop("plan_code")
        today = datetime.date.today()
        valid_date = today + relativedelta(months=plan.month_length)

        # print(user.username)
        if len(UserSubscription.objects.filter(id=user.id)) != 0:
            return UserSubscription.objects.filter(id=user.id)[0]

        subscription = UserSubscription.objects.create(
            user = user,
            id = user.id,
            plan = plan,
            valid_date = valid_date,
            cancelled = False,
            card_number = validated_data["card_number"],
            card_expiry = validated_data["card_expiry"],
            card_security_code = validated_data["card_security_code"],
        )

        # first payment
        Payment.objects.create(
            user = user,
            amount = plan.price,
            plan_month_length = plan.month_length,
            paid_card_number = validated_data["card_number"],
            paid_at = today,
            paid = True,
        )

        # future payment
        Payment.objects.create(
            user = user,
            amount = plan.price,
            plan_month_length = plan.month_length,
            paid_card_number = validated_data["card_number"],
            paid_at = valid_date,
            paid = False,
        )

        print(subscription.id)

        return subscription