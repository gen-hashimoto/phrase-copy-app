import boto3
from app.settings import settings

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_magic_link_email(
    to_email: str, verify_url: str, *, is_new_user: bool = False
) -> None:
    if is_new_user:
        subject = "Phrases へようこそ — ログインリンクをお送りします"
        text_body = (
            "Phrases をご利用いただきありがとうございます。\n"
            "アカウントの作成が完了しました。\n\n"
            "以下のリンクからログインを完了してください。\n"
            "※ このリンクは 15 分間有効です。期限を過ぎた場合は、"
            "再度ログイン画面からメールを送信してください。\n\n"
            f"{verify_url}\n\n"
            "※ 心当たりがない場合は、このメールを破棄してください。"
        )
        html_body = (
            "<p>Phrases をご利用いただきありがとうございます。</p>"
            "<p>アカウントの作成が完了しました。</p>"
            f'<p><a href="{verify_url}">ログインを完了する</a></p>'
            "<p><small>※ このリンクは 15 分間有効です。期限を過ぎた場合は、"
            "再度ログイン画面からメールを送信してください。</small></p>"
            "<p><small>※ 心当たりがない場合は、このメールを破棄してください。</small></p>"
        )
    else:
        subject = "Phrases ログインリンクのご案内"
        text_body = (
            "Phrases へのログインをリクエストいただきありがとうございます。\n\n"
            "以下のリンクからログインしてください。\n"
            "※ このリンクは 15 分間有効です。期限を過ぎた場合は、"
            "再度ログイン画面からメールを送信してください。\n\n"
            f"{verify_url}\n\n"
            "※ 心当たりがない場合は、このメールを破棄してください。"
        )
        html_body = (
            "<p>Phrases へのログインをリクエストいただきありがとうございます。</p>"
            f'<p><a href="{verify_url}">ログインする</a></p>'
            "<p><small>※ このリンクは 15 分間有効です。期限を過ぎた場合は、"
            "再度ログイン画面からメールを送信してください。</small></p>"
            "<p><small>※ 心当たりがない場合は、このメールを破棄してください。</small></p>"
        )

    if settings.email_backend == "smtp":
        send_via_smtp(to_email, subject, text_body, html_body)
    elif settings.email_backend == "ses":
        send_via_ses(to_email, subject, text_body, html_body)
    else:
        pass


def send_via_smtp(to_email: str, subject: str, text_body: str, html_body: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.ses_from_email
    msg["To"] = to_email
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.sendmail(settings.ses_from_email, [to_email], msg.as_string())


def send_via_ses(to_email: str, subject: str, text_body: str, html_body: str) -> None:
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
