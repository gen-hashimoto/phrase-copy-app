from abc import ABC, abstractmethod


class MailSender(ABC):
    @abstractmethod
    def send_magic_link(
        self,
        *,
        to_email: str,
        login_url: str,
        is_new_user: bool,
    ) -> None:
        """Deliver a magic-link login message."""
