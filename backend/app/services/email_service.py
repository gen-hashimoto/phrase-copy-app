import boto3
from app.settings import settings


def send_magic_link_email(
    to_email: str, verify_url: str, *, is_new_user: bool = False
) -> None:
    if is_new_user:
        subject = "Phrases へようこそ"
        text_body = (
            "Phrases へようこそ。アカウントを作成しました。\n\n"
            f"以下のリンクからログインを完了してください（15分間有効）:\n{verify_url}"
        )
        html_body = (
            "<p>Phrases へようこそ。アカウントを作成しました。</p>"
            f'<p><a href="{verify_url}">ログインを完了する</a></p>'
            "<p>15分間有効です。</p>"
        )
    else:
        subject = "ログインリンク"
        text_body = f"以下のリンクからログインしてください（15分間有効）:\n{verify_url}"
        html_body = (
            f'<p><a href="{verify_url}">ログインする</a></p><p>15分間有効です。</p>'
        )

    client = boto3.client("ses", region_name=settings.aws_region)
    client.send_email(
        Source=settings.ses_from_email,
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
