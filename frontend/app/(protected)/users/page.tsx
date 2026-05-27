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


    const openRoleModal = (user: User) => {
        setSelectedUser(user);
        setSelectedRoles([]); // or prefill if backend returns roles
        setShowRoleModal(true);
    };


    const handleAssignRoles = async () => {
        if (!selectedUser) return;

        try {
            await api.post(
                `/users/assign_role/${selectedUser.id}`,
                {
                    role_ids: selectedRoles,
                }
            );

            toast.success("Roles assigned successfully");
            setShowRoleModal(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to assign roles");
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
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[400px] p-5 rounded-xl shadow-lg space-y-4">

                        <h2 className="text-lg font-semibold">
                            Assign Roles to {selectedUser.name}
                        </h2>

                        <div className="space-y-2 max-h-[200px] overflow-auto">
                            {roles.map((role) => (
                                <label key={role.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRoles([...selectedRoles, role.id]);
                                            } else {
                                                setSelectedRoles(
                                                    selectedRoles.filter((id) => id !== role.id)
                                                );
                                            }
                                        }}
                                    />
                                    {role.name}
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="px-3 py-1 rounded bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAssignRoles}
                                className="px-3 py-1 rounded bg-blue-600 text-white"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}