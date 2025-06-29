from django.core.mail import send_mail,EmailMessage
from django.conf import settings

def send_otp_email(email,otp):
    subject = "Your One-Time Password (OTP) for Login"
    message = (
        f"Hello,\n\n"
        f"Your one-time password (OTP) for logging in is: {otp}\n\n"
        f"This OTP is valid for 5 minutes. Please do not share it with anyone.\n\n"
        f"If you did not request this, please ignore this email.\n\n"
        f"Thank you,\n"
    )
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)


def send_message_notification(from_user, message_content, all_user_emails):
    subject = f"New Message from {from_user}"
    body = (
        f"Hello,\n\n"
        f"{from_user} has posted a new message:\n\n"
        f"{message_content}\n\n"
        f"Please log in to view and reply.\n\n"
        
    )
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_HOST_USER,
        to=[],                      
        bcc=all_user_emails         
    )
    email.send(fail_silently=False)