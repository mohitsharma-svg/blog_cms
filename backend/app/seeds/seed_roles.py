from app.core.database import SessionLocal
from app.models.role import Role


def seed_roles():
    db = SessionLocal()

    print("Seeding roles...")

    roles = ["admin", "editor", "user"]

    for role in roles:
        exists = db.query(Role).filter_by(name=role).first()

        if not exists:
            db.add(Role(name=role))
            print(f"Added role: {role}")

    db.commit()
    db.close()

    print("Roles seeding completed.")