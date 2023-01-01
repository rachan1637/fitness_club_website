from django.contrib import admin
from .models import SubscriptionPlan, Payment, UserSubscription

# Register your models here.
# @admin.register(SubscriptionPlan)
# class SubscriptionAdmin(admin.ModelAdmin):
#     pass
admin.site.register(SubscriptionPlan)
admin.site.register(UserSubscription)
admin.site.register(Payment)