from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('register/', views.RegisterUser.as_view(), name='register'),
    path('verify_otp/', views.OTPVerify.as_view(), name='verify_otp'),
    path('send_otp/', views.SendOtp.as_view(), name='send_otp'),

    path('message/<int:pk>/', views.MessageDetail.as_view(), name='message'),
    path('messages/', views.Messages.as_view(), name='messages'),

]