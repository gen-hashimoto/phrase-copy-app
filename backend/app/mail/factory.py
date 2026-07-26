from __future__ import annotations

import os

from app.mail.base import MailSender
from app.mail.mock_sender import MockMailSender
from app.mail.resend_sender import ResendMailSender
from app.mail.ses_sender import SesMailSender


def create_mail_sender(provider: str | None = None) -> MailSender:
    name = (provider or os.getenv("MAIL_PROVIDER", "mock")).strip().lower()

    if name == "resend":
        return ResendMailSender()
    if name == "ses":
        return SesMailSender()
    if name == "mock":
        return MockMailSender()

    raise ValueError(
        f"Unknown MAIL_PROVIDER={name!r}. Expected one of: resend, ses, mock"
    )
