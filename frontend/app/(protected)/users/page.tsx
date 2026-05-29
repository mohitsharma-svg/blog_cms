"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DataTable from "@/app/components/ui/DataTable";

import api from "@/lib/api";
import { usePermission } from "@/app/hooks/usePermission";

import {
    Plus,
    Pencil,
    Trash2,
    ShieldCheck,
    ShieldX,
    UserCog,
} from "lucide-react";

import toast from "react-hot-toast";

type User = {
    id: number;
    sr_no?: number;
    name: string;
    email: string;
    status?: string;
    roles?: { id: number; name: string }[];
    action?: React.ReactNode;
};

export default function UsersPage() {
    const router = useRouter();
    const { can } = usePermission();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users/");
            const formatted = res.data.map((user: User, index: number) => ({
                sr_no: index + 1,
                ...user,
                roles: user.roles?.map((r: any) => r.name).join(", "),
                status: (
                    <span
                        className={`
                        inline-flex items-center gap-1
                        px-3 py-1
                        rounded-full
                        text-xs font-medium
                        ${user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                    `}
                    >
                        {user.status === "active" ? (
                            <>
                                <ShieldCheck className="w-3 h-3" />
                                Active
                            </>
                        ) : (
                            <>
                                <ShieldX className="w-3 h-3" />
                                Inactive
                            </>
                        )}
                    </span>
                ),

                action: (
                    <div className="flex items-center gap-2">

                        {can("user.status") && (
                            <button
                                onClick={() => handleStatus(user.id)}
                                className={`
                            p-2 rounded-lg transition cursor-pointer
                            ${user.status === "active"
                                        ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }
                        `}
                            >
                                {user.status === "active" ? (
                                    <ShieldX className="w-4 h-4" />
                                ) : (
                                    <ShieldCheck className="w-4 h-4" />
                                )}
                            </button>
                        )}

                        {can("user.assign_role") && (
                            <button
                                onClick={() => openRoleModal(user)}
                                className="
                                    p-2 rounded-lg
                                    bg-indigo-100 text-indigo-600
                                    hover:bg-indigo-200
                                    transition
                                    cursor-pointer
                                "
                            >
                                <UserCog className="w-4 h-4" />
                            </button>
                        )}

                        {can("user.update") && (
                            <button
                                onClick={() => router.push(`/users/edit/${user.id}`)}
                                className="
                            p-2 rounded-lg
                            bg-blue-100 text-blue-600
                            hover:bg-blue-200
                            transition
                            cursor-pointer
                        "
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        {can("user.delete") && (
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="
                            p-2 rounded-lg
                            bg-red-100 text-red-600
                            hover:bg-red-200
                            transition
                            cursor-pointer
                        "
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ),
            }));

            setUsers(formatted);

        } catch (error) {

            console.error(error);

            toast.error("Failed to fetch users");

        } finally {

            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await api.get("/roles/");
            setRoles(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm(
            "Are you sure you want to delete this user?"
        );
        if (!confirmDelete) return;
        try {
            await api.delete(`/users/delete/${id}`);
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user");
        }
    };

    const handleStatus = async (id: number) => {
        try {

            await api.get(`/users/status/${id}`);
            toast.success(`Status Updated`);
            await fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);


    const openRoleModal = (user: any) => {
        setSelectedUser(user);
        setSelectedRoles(
            user.roles?.map((role: any) => Number(role.id)) || []
        );

        setShowRoleModal(true);
    };


    const handleAssignRoles = async () => {
        if (!selectedUser || selectedRoles.length === 0) {
            toast.error("Please select at least one role");
            return;
        }

        try {
            // Convert all role ids to numbers (safe handling)
            const roleIds = selectedRoles.map((id) => Number(id));

            await api.post(`/users/assign_role/${selectedUser.id}`, {
                role_ids: roleIds, // supports single + multiple roles
            });

            toast.success(
                roleIds.length > 1
                    ? "Roles assigned successfully"
                    : "Role assigned successfully"
            );

            setShowRoleModal(false);
            setSelectedRoles([]);
            fetchUsers();
        } catch (err: any) {
            console.error(err);

            toast.error(
                err?.response?.data?.message || "Failed to assign roles"
            );
        }
    };

    const columns = [
        {
            key: "sr_no",
            label: "Sr.No.",
        },
        {
            key: "name",
            label: "Name",
            sortable: true,
        },
        {
            key: "email",
            label: "Email",
            sortable: true,
        },
        {
            key: "roles",
            label: "Roles",
            sortable: true,
        },
        {
            key: "status",
            label: "Status",
        },
        {
            key: "action",
            label: "Action",
        },
    ] as any;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">

                <h1 className="text-xl font-semibold text-slate-800">
                    Manage Users
                </h1>
                {can('user.create') && (
                    <button
                        onClick={() => router.push("/users/create")}
                        className="flex items-center gap-2
                        bg-gradient-to-r from-blue-600 to-purple-600
                        text-white
                        px-4 py-2
                        rounded-md
                        font-medium
                        shadow-md
                        hover:scale-[1.02]
                        active:scale-[0.98]
                        transition-all duration-200
                        cursor-pointer
                        ">
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                )}
            </div>
            {loading ? (
                <div className="glass p-6 rounded-xl text-center text-slate-500">
                    Loading users...
                </div>
            ) : (
                <DataTable data={users} columns={columns} />
            )}


            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">

                        {/* Header */}
                        <div className="border-b px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Assign Roles
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Manage roles for{" "}
                                <span className="font-medium text-gray-700">
                                    {selectedUser.name}
                                </span>
                            </p>
                        </div>

                        {/* Selected Roles */}
                        <div className="px-6 pt-4">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                                Selected Roles
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {selectedRoles.length > 0 ? (
                                    selectedRoles.map((roleId) => {
                                        const role = roles.find(
                                            (r) => Number(r.id) === Number(roleId)
                                        );

                                        return (
                                            <span
                                                key={roleId}
                                                className="flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium"
                                            >
                                                {role?.name}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedRoles((prev) =>
                                                            prev.filter(
                                                                (id) =>
                                                                    Number(id) !== Number(roleId)
                                                            )
                                                        )
                                                    }
                                                    className="text-blue-500 hover:text-red-500"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span className="text-sm text-gray-400">
                                        No roles selected
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Roles List */}
                        <div className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-600 mb-3">
                                Available Roles
                            </p>

                            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                                {roles.map((role) => {
                                    const roleId = Number(role.id);

                                    // FIXED CHECKED ISSUE
                                    const isSelected = selectedRoles.some(
                                        (id) => Number(id) === roleId
                                    );

                                    return (
                                        <label
                                            key={role.id}
                                            className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-all duration-200
                                ${isSelected
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedRoles((prev) => {
                                                                // prevent duplicate
                                                                if (
                                                                    prev.some(
                                                                        (id) =>
                                                                            Number(id) === roleId
                                                                    )
                                                                ) {
                                                                    return prev;
                                                                }

                                                                return [...prev, roleId];
                                                            });
                                                        } else {
                                                            setSelectedRoles((prev) =>
                                                                prev.filter(
                                                                    (id) =>
                                                                        Number(id) !== roleId
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className="h-4 w-4 accent-blue-600"
                                                />

                                                <span className="text-sm font-medium text-gray-700">
                                                    {role.name}
                                                </span>
                                            </div>

                                            {isSelected && (
                                                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                                    Selected
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
                            <button
                                onClick={() => {
                                    setShowRoleModal(false);
                                    setSelectedRoles([]);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAssignRoles}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition shadow-md"
                            >
                                Save Roles
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}