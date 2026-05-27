def permission_validator(permission: str):
    try:
        if not permission:
            raise ValueError("Permission is required")

        permission = permission.strip().lower()

        parts = permission.split(".")

        if len(parts) != 2:
            raise ValueError(
                "Invalid permission format. Use: module.action"
            )

        module, action = parts

        if not module:
            raise ValueError("Module name is required")

        if not action:
            raise ValueError("Action name is required")

        # allowed_actions = [
        #     "view",
        #     "create",
        #     "update",
        #     "delete",
        #     "status",
        #     "assign_role",
        # ]

        # if action not in allowed_actions:
        #     raise ValueError(
        #         f"Invalid action '{action}'"
        #     )

        return True

    except AttributeError:
        raise ValueError(
            "Permission must be a string"
        )

    except Exception as e:
        raise ValueError(str(e))

def format_permission_name(permission: str):
    module, action = permission.split(".")
    return f"{action} {module}".upper()