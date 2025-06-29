from django.db import models
from django.contrib.auth.models import AbstractUser
from .mangers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = CustomUserManager()


from django.utils import timezone
from datetime import timedelta
def expiry_time():
    return timezone.now() + timedelta(minutes=5)

class Otp(models.Model):
    email = models.EmailField()
    otp = models.PositiveIntegerField()
    exp = models.DateTimeField(default=expiry_time)

    def is_expired(self):
        if timezone.now() > self.exp:
            return True
        return False
    
    def __str__(self):
        return f'{self.email} {self.otp}'
    


from django.contrib.auth import get_user_model
User = get_user_model()


class Message(models.Model):
    message = models.TextField()
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='messages')
    created_at = models.DateTimeField(default=timezone.now) 

    def __str__(self):
        return self.message[:10]
    
    class Meta:
        ordering  = ['-created_at']

    