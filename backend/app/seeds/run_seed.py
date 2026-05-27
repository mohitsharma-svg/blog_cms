from app.seeds.seed_permissions import seed_permissions
from app.seeds.seed_roles import seed_roles
from app.seeds.seed_role_permissions import seed_role_permissions
from app.seeds.seed_users import seed_users
from app.seeds.seed_user_roles import seed_user_roles


def run_all_seeds():
    seed_permissions()
    seed_roles()
    seed_role_permissions()
    seed_users()
    seed_user_roles()

    print("ALL SEEDS COMPLETED")


if __name__ == "__main__":
    run_all_seeds()