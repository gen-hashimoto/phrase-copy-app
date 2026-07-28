from app.mail.base import MailSender

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.mail.content import build_magic_link_content


class DevSmtpMailSender(MailSender):
    def __init__(
        self,
        *,
        from_email: str | None = None,
        smtp_host: str,
        smtp_port: int,
    ) -> None:
        self._from_email = from_email
        self._smtp_host = smtp_host
        self._smtp_port = smtp_port

    def send_magic_link(
        self,
        *,
        to_email: str,
        login_url: str,
        is_new_user: bool,
    ) -> None:
        subject, text_body, html_body = build_magic_link_content(
            login_url=login_url, is_new_user=is_new_user
        )

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self._from_email or ""
        msg["To"] = to_email
        msg.attach(MIMEText(text_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))
        with smtplib.SMTP(self._smtp_host, self._smtp_port) as server:
            server.sendmail(self._from_email or "", [to_email], msg.as_string())
