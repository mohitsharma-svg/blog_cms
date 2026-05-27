from app.core.database import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.models.user_roles import user_roles
from app.core.security import hash_password


def seed_admin():
    db = SessionLocal()

    try:
        # 1. Check or create role
        role = db.query(Role).filter(Role.name == "admin").first()

        if not role:
            role = Role(name="admin", status="active")
            db.add(role)
            db.commit()
            db.refresh(role)

        # 2. Check or create user
        user = db.query(User).filter(User.email == "admin@gmail.com").first()

        if not user:
            user = User(
                name="Admin",
                email="admin@gmail.com",
                password_hash=hash_password("admin123"),
                status="active"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # 3. Assign role (ONLY ONCE)
        exists = db.execute(
            user_roles.select().where(
                (user_roles.c.user_id == user.id) &
                (user_roles.c.role_id == role.id)
            )
        ).fetchone()

        if not exists:
            db.execute(
                user_roles.insert().values(
                    user_id=user.id,
                    role_id=role.id
                )
            )
            db.commit()

        print("✔ Admin setup completed safely")

    except Exception as e:
        db.rollback()
        print("❌ Seeder error:", str(e))

    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()