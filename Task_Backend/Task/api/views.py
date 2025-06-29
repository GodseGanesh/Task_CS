from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK,HTTP_201_CREATED,HTTP_400_BAD_REQUEST
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

class RegisterUser(APIView):
    def post(self,request,*args, **kwargs):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message':'user created successfully'},status=HTTP_201_CREATED)
        
        return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)
    

import random
from .helpers import send_otp_email
User = get_user_model()


class SendOtp(APIView):
    def post(self,request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "email is required"}, status=400)
        
        user = User.objects.filter(email=email).exists()
        if not user:
            return Response({"error": "User Does Not Exists"}, status=400)
        
        otp = random.randint(1000,9999)
        send_otp_email(email,otp)

        Otp.objects.update_or_create(
            email=email,
            defaults={
                "otp": otp,
                "exp": timezone.now() + timedelta(minutes=5),
            },
        )

        return Response({'message':'otp send sucessfully'},status=HTTP_200_OK)
        





class OTPVerify(APIView):
    def post(self, request):
        serializer = OtpVerifySerializer(data=request.data)
        if serializer.is_valid():
            otp_record = serializer.validated_data["otp_data"]
            user = get_object_or_404(User, email=otp_record.email)

        
            refresh = RefreshToken.for_user(user)

        
            otp_record.delete()

            return Response({
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },status=HTTP_200_OK)
        
        return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)
    

from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

class Messages(ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user=self.request.user)

class MessageDetail(RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
