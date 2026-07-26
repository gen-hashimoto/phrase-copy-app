from app.mail.base import MailSender


class SesMailSender(MailSender):
    def send_magic_link(
        self,
        *,
        to_email: str,
        login_url: str,
        is_new_user: bool,
    ) -> None:
        # TODO: Amazon SES (boto3) 実装をここに移植する
        pass
