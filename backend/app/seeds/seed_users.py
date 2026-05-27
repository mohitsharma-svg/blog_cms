from uuid import uuid4

from app.core.database import SessionLocal
from app.core.security import hash_password

from app.models.user import User


USERS = [
    {
        "name": "Admin",
        "email": "admin@gmail.com",
        "password": "123456"
    },
    {
        "name": "Editor",
        "email": "editor@gmail.com",
        "password": "123456"
    }
]


def seed_users():
    db = SessionLocal()

    print("Seeding users...")

    for item in USERS:

        exists = db.query(User).filter_by(
            email=item["email"]
        ).first()

        if not exists:

            user = User(
                name=item["name"],
                email=item["email"],
                password_hash=hash_password(item["password"])
            )

            db.add(user)

    db.commit()
    db.close()

    print("Users seeded successfully")


if __name__ == "__main__":
    seed_users()