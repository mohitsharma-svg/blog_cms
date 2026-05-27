def clean_text(value: str | None):
    if value is None:
        return None
    return value.strip()