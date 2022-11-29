from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
# Reference: https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html#onetoone

class Profile(models.Model):
    # Note: email is saved in user, the user should include username, password and email.
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    email = models.EmailField(blank=True)
    first_name = models.CharField(max_length=200, blank=True)
    last_name = models.CharField(max_length=200, blank=True)
    avatar = models.ImageField(default="default.jpg")
    phone_number = PhoneNumberField(blank=True)

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(
                user=instance,
                email=instance.email,
                first_name=instance.first_name,
                last_name=instance.last_name,
            )
            # print(instance.username)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()
        # print(instance.profile)