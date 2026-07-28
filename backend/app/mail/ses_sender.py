import boto3
from app.mail.base import MailSender
from app.mail.content import build_magic_link_content


class SesMailSender(MailSender):
    def __init__(
        self,
        *,
        from_email: str | None = None,
        region_name: str | None = None,
    ) -> None:
        self._from_email = from_email
        self._region_name = region_name

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

        client = boto3.client("ses", region_name=self._region_name)
        client.send_email(
            Source=self._from_email,
            Destination={"ToAddresses": [to_email]},
            Message={
                "Subject": {"Data": subject, "Charset": "utf-8"},
                "Body": {
                    "Text": {
                        "Data": text_body,
                        "Charset": "utf-8",
                    },
                    "Html": {
                        "Data": html_body,
                        "Charset": "utf-8",
                    },
                },
            },
        )
