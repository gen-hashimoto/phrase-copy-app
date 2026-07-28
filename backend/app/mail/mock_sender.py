from app.mail.base import MailSender


class MockMailSender(MailSender):
    def send_magic_link(
        self,
        *,
        to_email: str,
        login_url: str,
        is_new_user: bool,
    ) -> None:
        print(
            "[MockMailSender]",
            f"to_email={to_email!r}",
            f"login_url={login_url!r}",
            f"is_new_user={is_new_user!r}",
        )
