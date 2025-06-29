from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import *
from .helpers import send_message_notification
from django.contrib.auth import get_user_model
User = get_user_model()


@receiver(post_save,sender=Message)
def send_notification_to_all_users(sender,instance,created,**kwargs):
    if created:
        users_emails= User.objects.all().exclude(email=instance.user.email).values_list('email',flat=True)
        send_message_notification(instance.user.email,instance.message,list(users_emails))
       
        

