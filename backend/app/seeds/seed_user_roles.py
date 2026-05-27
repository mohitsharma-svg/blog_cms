from app.core.database import SessionLocal

from app.models.user import User
from app.models.role import Role


def seed_user_roles():
    db = SessionLocal()

    print("Seeding user roles...")

    # Example users
    admin_user = db.query(User).filter_by(
        email="admin@gmail.com"
    ).first()

    editor_user = db.query(User).filter_by(
        email="editor@gmail.com"
    ).first()

    # Example roles
    admin_role = db.query(Role).filter_by(
        name="admin"
    ).first()

    editor_role = db.query(Role).filter_by(
        name="editor"
    ).first()

    # Assign roles
    if admin_user and admin_role:
        if admin_role not in admin_user.roles:
            admin_user.roles.append(admin_role)

    if editor_user and editor_role:
        if editor_role not in editor_user.roles:
            editor_user.roles.append(editor_role)

    db.commit()
    db.close()

    print("User roles seeded successfully")