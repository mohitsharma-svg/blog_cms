from hashids import Hashids

HASH_SALT = "your-super-secret-salt-change-this"
HASH_MIN_LENGTH = 8

hashids = Hashids(salt=HASH_SALT, min_length=HASH_MIN_LENGTH)


def encode_id(id: int) -> str:
    return hashids.encode(id)


def decode_id(hash_id: str) -> int:
    decoded = hashids.decode(hash_id)
    return decoded[0] if decoded else None