import boto3
from app.settings import settings


def send_magic_link_email(to_email: str, verify_url: str) -> None:
    client = boto3.client("ses", region_name=settings.aws_region)
    client.send_email(
        Source=settings.ses_from_email,
        Destination={"ToAddresses": [to_email]},
        Message={
            "Subject": {"Data": "ログインリンク", "Charset": "utf-8"},
            "Body": {
                "Text": {
                    "Data": f"以下のリンクを開いてログインしてください:\n{verify_url}\n\n15分間有効です。",
                    "Charset": "utf-8",
                },
                "Html": {
                    "Data": f'<p><a href="{verify_url}">ログインする</a></p>',
                    "Charset": "utf-8",
                },
            },
        },
    )
