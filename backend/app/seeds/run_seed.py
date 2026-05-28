from app.core.database import SessionLocal
from app.core.security import hash_password

from app.models.permission import Permission
from app.models.role import Role
from app.models.user import User
from app.models.menu import Menu


PERMISSIONS = [
    "dashboard.view",
    "post.view", "post.create", "post.update", "post.delete", "post.status",
    "category.view", "category.create", "category.update", "category.delete", "category.status",
    "user.view", "user.create", "user.update", "user.delete", "user.status", "user.assign_role",
    "role.view", "role.create", "role.update", "role.delete", "role.status",
    "permission.view", "permission.create", "permission.update", "permission.delete", "permission.status",
    "menu.view", "menu.create", "menu.update", "menu.delete", "menu.status",
]

ROLES = ["admin", "editor", "user"]

USERS = [
    {
        "name": "Admin",
        "email": "admin@gmail.com",
        "password": "123456",
        "roles": ["admin"]
    },
    {
        "name": "Editor",
        "email": "editor@gmail.com",
        "password": "123456",
        "roles": ["editor"]
    },
    {
        "name": "User",
        "email": "user@gmail.com",
        "password": "123456",
        "roles": ["user"]
    },
]


ROLE_PERMISSIONS = {
    "admin": "*",
    "editor": [
        "post.view",
        "post.create",
        "post.update",
        "category.view",
        "menu.view",
    ],
    "user": [
        "post.view",
        "category.view",
        "menu.view",
    ],
}


MENUS = [
    {"name": "Dashboard", "path": "/dashboard", "sort_order":"1", "icon": "dashboard"},
    {"name": "Posts", "path": "/posts", "sort_order":"3", "icon": "file"},
    {"name": "Categories", "path": "/categories", "sort_order":"2", "icon": "folder"},
    {"name": "Users", "path": "/users", "sort_order":"4", "icon": "users"},
    {"name": "Roles", "path": "/roles", "sort_order":"5", "icon": "shield"},
    {"name": "Permissions", "path": "permissions", "sort_order":"6", "icon": "key"},
]


def run_all_seeds():
    db = SessionLocal()

    try:
        print("\n========== START SEEDING ==========\n")

        # -------------------------
        # 5. MENUS
        # -------------------------
        print("Seeding menus...")

        for m in MENUS:
            exists = db.query(Menu).filter_by(label=m["name"]).first()

            if not exists:
                db.add(Menu(
                    label=m["name"],
                    href=m["path"],
                    sort_order=m["sort_order"],
                    icon=m.get("icon"),
                    is_active=True
                ))

        db.commit()
        print("✅ Menus seeded")

        # -------------------------
        # 1. PERMISSIONS
        # -------------------------
        print("Seeding permissions...")

        for p in PERMISSIONS:
            if not db.query(Permission).filter_by(name=p).first():
                db.add(Permission(name=p))

        db.commit()
        print("✅ Permissions seeded")

        # -------------------------
        # 2. ROLES
        # -------------------------
        print("Seeding roles...")

        for r in ROLES:
            if not db.query(Role).filter_by(name=r).first():
                db.add(Role(name=r))

        db.commit()
        print("✅ Roles seeded")

        # -------------------------
        # 3. ROLE PERMISSIONS
        # -------------------------
        print("Assigning role permissions...")

        all_permissions = db.query(Permission).all()

        for role_name, perms in ROLE_PERMISSIONS.items():

            role = db.query(Role).filter_by(name=role_name).first()
            if not role:
                continue

            if perms == "*":
                role.permissions = all_permissions
            else:
                role.permissions = [
                    p for p in all_permissions if p.name in perms
                ]

        db.commit()
        print("✅ Role permissions assigned")

        # -------------------------
        # 4. USERS + USER_ROLE TABLE
        # -------------------------
        print("Seeding users + user_roles...")

        for u in USERS:

            user = db.query(User).filter_by(email=u["email"]).first()

            if not user:
                user = User(
                    name=u["name"],
                    email=u["email"],
                    password_hash=hash_password(u["password"]),
                )
                db.add(user)
                db.flush()  # get user.id before commit

            # assign roles (THIS IS YOUR user_roles TABLE)
            for role_name in u["roles"]:
                role = db.query(Role).filter_by(name=role_name).first()

                if role and role not in user.roles:
                    user.roles.append(role)

        db.commit()
        print("✅ Users + user_roles seeded")

        print("\n========== ALL SEEDS COMPLETED ==========\n")

    except Exception as e:
        db.rollback()
        print("❌ SEED ERROR:", e)

    finally:
        db.close()


if __name__ == "__main__":
    run_all_seeds()