from __future__ import annotations

import json
import urllib.error
import urllib.request

from app.mail.base import MailSender
from app.mail.content import build_magic_link_content

RESEND_API_URL = "https://api.resend.com/emails"


class ResendMailSender(MailSender):
    def __init__(
        self,
        api_key: str | None = None,
        *,
        from_email: str | None = None,
    ) -> None:
        self._api_key = api_key
        self._from_email = from_email

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
        payload = {
            "from": self._from_email,
            "to": [to_email],
            "subject": subject,
            "text": text_body,
            "html": html_body,
        }
        # Cloudflare (in front of api.resend.com) may return 403 / error 1010
        # when the default Python-urllib User-Agent is used.
        request = urllib.request.Request(
            RESEND_API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
                "User-Agent": "phrase-copy-app/1.0",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request) as response:
                response.read()
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(
                f"Resend API failed with status {exc.code}:{detail}"
            ) from exc
