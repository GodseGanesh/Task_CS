from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['email','password','password2']

    def validate(self, data):
        if data['password2'] != data['password']:
            raise serializers.ValidationError('password do not match')
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)

        return user
    
class OtpVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.IntegerField()

    def validate(self,data):
        email = data['email']
        otp = data['otp']

        try:
            otp_data = Otp.objects.get(email=email,otp=otp)
        except Exception as e:
            raise serializers.ValidationError("Invalid OTP or email.")
        
        if otp_data.is_expired():
            raise serializers.ValidationError("OTP expired.")
        
        data['otp_data']= otp_data
        return data
    

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id','user','message']