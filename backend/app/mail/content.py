def build_magic_link_content(
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
            "※ このリンクは 15 分間有効です。期限を過ぎた場合は、"
            "再度ログイン画面からメールを送信してください。\n\n"
            f"{login_url}\n"
            "※ 心当たりがない場合は、このメールを破棄してください。"
        )
        html_body = (
            "<p>Phrases をご利用いただきありがとうございます。</p>"
            "<p>アカウントの作成が完了しました。</p>"
            f'<p><a href="{login_url}">ログインを完了する</a></p>'
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
            f"{login_url}\n"
            "※ 心当たりがない場合は、このメールを破棄してください。"
        )
        html_body = (
            "<p>Phrases へのログインをリクエストいただきありがとうございます。</p>"
            f'<p><a href="{login_url}">ログインする</a></p>'
            "<p><small>※ このリンクは 15 分間有効です。期限を過ぎた場合は、"
            "再度ログイン画面からメールを送信してください。</small></p>"
            "<p><small>※ 心当たりがない場合は、このメールを破棄してください。</small></p>"
        )

    return subject, text_body, html_body
