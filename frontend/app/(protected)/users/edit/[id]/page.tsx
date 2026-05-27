"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";


import api from "@/lib/api";

import toast from "react-hot-toast";

import { Save, User, Mail } from "lucide-react";

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const fetchUser = async () => {
        try {
            const res = await api.get(`/users/${id}`);
            setFormData({
                name: res.data.name,
                email: res.data.email,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch user");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.put(`/users/update/${id}`, formData);
            toast.success("User updated successfully");
            router.push("/users");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="max-w-full">
                <div
                    className="
                        glass
                        rounded-2xl
                        p-6
                        border border-white/40
                        shadow-lg
                    "
                >
                    <h1 className="text-2xl font-semibold text-slate-800 mb-6">
                        Edit User
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div className="flex gap-8">
                            <div className="w-full">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                    Full Name
                                </label>

                                <div className="
                                    flex items-center gap-3
                                    border border-slate-200
                                    rounded-xl
                                    px-4
                                    bg-white/70
                                    focus-within:border-blue-500
                                ">

                                    <User className="w-5 h-5 text-slate-400" />

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="
                                            w-full
                                            py-3
                                            bg-transparent
                                            outline-none
                                        "
                                    />
                                </div>
                            </div>

                            <div className="w-full">

                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                    Email Address
                                </label>

                                <div className="
                                    flex items-center gap-3
                                    border border-slate-200
                                    rounded-xl
                                    px-4
                                    bg-white/70
                                    focus-within:border-blue-500
                                ">

                                    <Mail className="w-5 h-5 text-slate-400" />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="
                                            w-full
                                            py-3
                                            bg-transparent
                                            outline-none
                                        "
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="flex items-center justify-start gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    flex items-center gap-2
                                    bg-gradient-to-r from-blue-600 to-purple-600
                                    text-white
                                    px-5 py-2.5
                                    rounded-xl
                                    font-medium
                                    shadow-lg
                                    hover:scale-[1.02]
                                    active:scale-[0.98]
                                    transition-all duration-200
                                    disabled:opacity-70
                                    cursor-pointer
                                "
                            >
                                <Save className="w-4 h-4" />

                                {loading ? "Updating..." : "Update User"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

    );
}