"use client";

import { useState } from "react";
import { ArrowLeft, Save, User, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CreateUserPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password_hash: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            await api.post("/users", formData);
            toast.success("Users Created successfully");
            router.push("/users");
        } catch (error) {
            console.error(error);
            toast.error("Users Creation Failed!");
            alert("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Create User
                    </h1>
                </div>

                <button
                    onClick={() => router.back()}
                    className="
                        flex items-center gap-2
                        px-4 py-2
                        rounded-xl
                        border border-[var(--border)]
                        bg-white
                        hover:bg-slate-50
                        transition
                        cursor-pointer
                        "
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            </div>

            <div className="glass p-6 rounded-2xl shadow-sm">

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Name */}
                        <div className="w-full">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Full Name
                            </label>

                            <div className="field h-12">
                                <User className="w-5 h-5 text-slate-400" />

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="w-full">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Email Address
                            </label>

                            <div className="field h-12">
                                <Mail className="w-5 h-5 text-slate-400" />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="w-full">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Password
                            </label>

                            <div className="field h-12">
                                <Shield className="w-5 h-5 text-slate-400" />

                                <input
                                    type="password"
                                    name="password_hash"
                                    placeholder="Enter password"
                                    value={formData.password_hash}
                                    onChange={handleChange}
                                    className="input w-full h-full"
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

                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}