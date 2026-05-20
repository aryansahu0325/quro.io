import os
import httpx
import logging
import datetime
from config import settings
from worker import celery_app

logger = logging.getLogger("quro.email")

def time_year():
    return datetime.datetime.now().year

def _dispatch_sync(email: str, subject: str, html_body: str, fallback_val: str):
    """Synchronous dispatcher for Celery workers using httpx.Client."""
    api_key = settings.RESEND_API_KEY
    sender = "Quro AI <onboarding@resend.dev>"
    use_sandbox = not api_key or "re_" not in api_key
    
    if use_sandbox:
        print("\n" + "=" * 60)
        print(f"📧 [CELERY WORKER - SANDBOX] Sending to: {email}")
        print(f"📌 Subject: {subject}")
        print(f"🔑 Verification/Reset Code: {fallback_val}")
        print("=" * 60 + "\n")
        logger.info(f"Sandbox Email Sent Successfully to {email}. Code: {fallback_val}")
        return True
        
    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": sender,
                    "to": email,
                    "subject": subject,
                    "html": html_body
                }
            )
            
            if res.status_code in [200, 201, 202]:
                logger.info(f"Resend email sent successfully to {email} (ID: {res.json().get('id')})")
                return True
            else:
                logger.error(f"Resend email dispatch failed: {res.status_code} - {res.text}. Falling back to sandbox output.")
                print(f"\n📧 [RESEND DISPATCH ERROR - FALLBACK LOG] Target: {email} | Key: {fallback_val}\n")
                return True
    except Exception as e:
        logger.error(f"Error calling Resend API: {e}. Falling back to sandbox output.")
        print(f"\n📧 [RESEND EXCEPTION - FALLBACK LOG] Target: {email} | Key: {fallback_val}\n")
        return True

@celery_app.task(name="email.send_verification_otp")
def send_verification_otp_task(email: str, otp: str, verify_link: str):
    subject = "🔐 Verify Your Quro AI Account"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{ font-family: sans-serif; background-color: #0c0d10; color: #e2e8f0; padding: 20px; }}
            .container {{ max-width: 550px; margin: 0 auto; background-color: #121318; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; }}
            .header {{ background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 32px; text-align: center; }}
            .logo {{ font-size: 24px; font-weight: 800; color: #ffffff; text-decoration: none; }}
            .logo-dot {{ color: #10b981; }}
            .content {{ padding: 40px 32px; }}
            .otp-box {{ background-color: #0c0d10; border: 1px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }}
            .otp-code {{ font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #10b981; }}
            .btn {{ display: block; background-color: #10b981; color: #000000; text-decoration: none; text-align: center; font-weight: 700; padding: 14px 32px; border-radius: 8px; margin: 24px auto; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><span class="logo">quro<span class="logo-dot">.</span>io</span></div>
            <div class="content">
                <h1 style="color: white; font-size: 20px;">Verify your email address</h1>
                <p>Welcome to Quro AI! To complete your registration and unlock unlimited secure RAG document intelligence, please enter the following 6-digit verification code:</p>
                <div class="otp-box"><div class="otp-code">{otp}</div></div>
                <p>Alternatively, verify your account immediately with a single click using the button below:</p>
                <a href="{verify_link}" class="btn" style="color: black !important;">Verify Account Link</a>
            </div>
        </div>
    </body>
    </html>
    """
    _dispatch_sync(email, subject, html_content, fallback_val=otp)

@celery_app.task(name="email.send_login_otp")
def send_login_otp_task(email: str, otp: str):
    subject = "🔑 Your Quro AI One-Time Login Code"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><style>body {{ font-family: sans-serif; background-color: #0c0d10; color: #e2e8f0; padding: 20px; }} .container {{ max-width: 550px; margin: 0 auto; background-color: #121318; border: 1px solid #1f2937; border-radius: 16px; padding: 32px; text-align: center; }} .otp-code {{ font-family: monospace; font-size: 32px; font-weight: 800; color: #10b981; letter-spacing: 6px; padding: 20px; border: 1px solid #10b981; border-radius: 12px; margin: 20px 0; }}</style></head>
    <body>
        <div class="container">
            <h2 style="color: white;">Your One-Time Login Code</h2>
            <p>Enter the following 6-digit code on the sign-in modal to access your Quro AI workspace. This code is unique and expires in 10 minutes:</p>
            <div class="otp-code">{otp}</div>
            <p style="font-size: 12px; color: #475569;">If you did not request this login code, you can safely ignore this email.</p>
        </div>
    </body>
    </html>
    """
    _dispatch_sync(email, subject, html_content, fallback_val=otp)

@celery_app.task(name="email.send_welcome_email")
def send_welcome_email_task(email: str):
    subject = "🚀 Welcome to the Future of Document Intelligence"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><style>body {{ font-family: sans-serif; background-color: #0c0d10; color: #e2e8f0; padding: 20px; }} .container {{ max-width: 550px; margin: 0 auto; background-color: #121318; border: 1px solid #1f2937; border-radius: 16px; padding: 32px; text-align: center; }} .btn {{ display: inline-block; background-color: #10b981; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 20px; }}</style></head>
    <body>
        <div class="container">
            <h1 style="color: white;">Welcome to Quro AI!</h1>
            <p>Your account is fully verified and ready to go.</p>
            <p>Start uploading PDFs and unlocking infinitely scalable neural insights instantly. Your data is AES-256 encrypted and stored safely.</p>
            <a href="{settings.VITE_BACKEND_API}" class="btn" style="color: black !important;">Go to Workspace</a>
        </div>
    </body>
    </html>
    """
    _dispatch_sync(email, subject, html_content, fallback_val="WELCOME_SENT")

@celery_app.task(name="email.send_password_reset_otp")
def send_password_reset_otp_task(email: str, otp: str):
    subject = "🔒 Reset Your Quro AI Password"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><style>body {{ font-family: sans-serif; background-color: #0c0d10; color: #e2e8f0; padding: 20px; }} .container {{ max-width: 550px; margin: 0 auto; background-color: #121318; border: 1px solid #1f2937; border-radius: 16px; padding: 32px; text-align: center; }} .otp-code {{ font-family: monospace; font-size: 32px; font-weight: 800; color: #ef4444; letter-spacing: 6px; padding: 20px; border: 1px solid #ef4444; border-radius: 12px; margin: 20px 0; }}</style></head>
    <body>
        <div class="container">
            <h2 style="color: white;">Password Reset Request</h2>
            <p>We received a request to reset the password for your Quro AI account. Enter the following 6-digit code to reset it:</p>
            <div class="otp-code">{otp}</div>
            <p style="font-size: 12px; color: #475569;">This code expires in 15 minutes. If you did not request this, please secure your account.</p>
        </div>
    </body>
    </html>
    """
    _dispatch_sync(email, subject, html_content, fallback_val=otp)
