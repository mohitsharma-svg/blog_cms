from app.core.database import SessionLocal
from app.models.role import Role
from app.models.permission import Permission


def seed_role_permissions():
    db = SessionLocal()

    print("Assigning permissions to roles...")

    admin = db.query(Role).filter_by(name="admin").first()
    editor = db.query(Role).filter_by(name="editor").first()
    user = db.query(Role).filter_by(name="user").first()

    all_permissions = db.query(Permission).all()

    admin.permissions = all_permissions

    editor.permissions = [
        p for p in all_permissions
        if p.name in [
            "post.view",
            "post.create",
            "post.update",
            "category.view"
        ]
    ]

    user.permissions = [
        p for p in all_permissions
        if p.name in [
            "post.view",
            "category.view"
        ]
    ]

    db.commit()
    db.close()

    print("Role permissions assigned.")