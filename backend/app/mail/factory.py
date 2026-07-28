from __future__ import annotations
from app.settings import settings

from app.mail.base import MailSender
from app.mail.mock_sender import MockMailSender
from app.mail.resend_sender import ResendMailSender
from app.mail.ses_sender import SesMailSender
from app.mail.dev_smtp_sender import DevSmtpMailSender


def create_mail_sender(provider: str | None = None) -> MailSender:
    # dev_link is handled in auth (returns a link in the API response).
    name = (provider or settings.mail_provider).strip().lower()

    if name == "resend":
        return ResendMailSender(
            api_key=settings.resend_api_key,
            from_email=settings.from_email,
        )
    if name == "ses":
        return SesMailSender(
            from_email=settings.from_email,
            region_name=settings.aws_region,
        )
    if name == "dev_smtp":
        return DevSmtpMailSender(
            from_email=settings.from_email,
            smtp_host=settings.smtp_host,
            smtp_port=settings.smtp_port,
        )
    if name == "mock":
        return MockMailSender()

    raise ValueError(
        f"Unknown MAIL_PROVIDER={name!r}.\n"
        "Expected one of: resend, ses, dev_smtp, mock.\n"
        "Note: dev_link is handled in auth, not here."
    )
