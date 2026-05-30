import os
import httpx
import logging
import datetime
from jinja2 import Environment, FileSystemLoader
from config import settings
from worker import celery_app

logger = logging.getLogger("quro.email")

template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "emails")
env = Environment(loader=FileSystemLoader(template_dir))

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
    template = env.get_template("verification_otp.html")
    html_content = template.render(otp=otp, verify_link=verify_link)
    _dispatch_sync(email, subject, html_content, fallback_val=otp)

@celery_app.task(name="email.send_login_otp")
def send_login_otp_task(email: str, otp: str):
    subject = "🔑 Your Quro AI One-Time Login Code"
    template = env.get_template("login_otp.html")
    html_content = template.render(otp=otp)
    _dispatch_sync(email, subject, html_content, fallback_val=otp)

@celery_app.task(name="email.send_welcome_email")
def send_welcome_email_task(email: str):
    subject = "🚀 Welcome to the Future of Document Intelligence"
    template = env.get_template("welcome.html")
    html_content = template.render(workspace_link=settings.VITE_BACKEND_API)
    _dispatch_sync(email, subject, html_content, fallback_val="WELCOME_SENT")

@celery_app.task(name="email.send_password_reset_otp")
def send_password_reset_otp_task(email: str, otp: str):
    subject = "🔒 Reset Your Quro AI Password"
    template = env.get_template("password_reset.html")
    html_content = template.render(otp=otp)
    _dispatch_sync(email, subject, html_content, fallback_val=otp)

@celery_app.task(name="email.send_promotional_email")
def send_promotional_email_task(email: str, subject: str, dynamic_html: str):
    template = env.get_template("promotional.html")
    html_content = template.render(html_content=dynamic_html, current_year=time_year())
    _dispatch_sync(email, subject, html_content, fallback_val="PROMO_SENT")
