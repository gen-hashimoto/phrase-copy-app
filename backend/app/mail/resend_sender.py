from __future__ import annotations

import json
import os
import urllib.error
import urllib.request

from app.mail.base import MailSender

RESEND_API_URL = "https://api.resend.com/emails"


class ResendMailSender(MailSender):
    def __init__(
        self,
        api_key: str | None = None,
        *,
        from_email: str | None = None,
    ) -> None:
        self._api_key = api_key or os.environ["RESEND_API_KEY"]
        self._from_email = from_email or os.getenv(
            "RESEND_FROM_EMAIL", "onboarding@resend.dev"
        )

    def send_magic_link(
        self,
        *,
        to_email: str,
        login_url: str,
        is_new_user: bool,
    ) -> None:
        subject, text_body, html_body = self._build_content(
            login_url=login_url, is_new_user=is_new_user
        )
        payload = {
            "from": self._from_email,
            "to": [to_email],
            "subject": subject,
            "text": text_body,
            "html": html_body,
        }
        request = urllib.request.Request(
            RESEND_API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json,",
            },
        )
        try:
            with urllib.request.urlopen(request) as response:
                response.read()
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(
                f"Resend API failed with status {exc.code}:{detail}"
            ) from exc

    @staticmethod
    def _build_content(
        *,
        login_url: str,
        is_new_user: bool,
    ) -> tuple[str, str, str]:
        if is_new_user:
            subject = "Phrases へようこそ - ログインリンクをお送りします"
            text_body = (
                "Phrases をご利用いただきありがとうございます。\n"
                "アカウントの作成が完了しました。\n\n"
                "以下のリンクからログインを完了してください。\n"
                f"{login_url}\n"
            )
            html_body = (
                "<p>Phrases をご利用いただきありがとうございます。</p>"
                "<p>アカウントの作成が完了しました。</p>"
                f'<p><a href="{login_url}">ログインを完了する</a></p>'
            )
        else:
            subject = "Phrases ログインリンクのご案内"
            text_body = (
                "Phrases へのログインをリクエストいただきありがとうございます。\n\n"
                "以下のリンクからログインしてください。\n"
                f"{login_url}\n"
            )
            html_body = (
                "<p>Phrases へのログインをリクエストいただきありがとうございます。</p>"
                f'<p><a href="{login_url}">ログインする</a></p>'
            )

        return subject, text_body, html_body
