from app.core.database import SessionLocal
from app.models.permission import Permission
from app.seeds.permissions import PERMISSIONS


def seed_permissions():
    db = SessionLocal()

    print("Seeding permissions...")

    for perm in PERMISSIONS:
        exists = db.query(Permission).filter_by(name=perm).first()

        if not exists:
            db.add(Permission(name=perm))
            print(f"Added: {perm}")

    db.commit()
    db.close()

    print("Permissions seeding completed.")