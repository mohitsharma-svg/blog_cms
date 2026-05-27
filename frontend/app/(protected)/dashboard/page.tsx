"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { usePermission } from "@/app/hooks/usePermission";
import api from "@/lib/api";

type DashboardItem = {
  title: string;
  count: number;
  link: string;
  permission: string;
};

function StatCard({
  title,
  value,
  link,
}: {
  title: string;
  value: string | number;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className="glass p-6 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition cursor-pointer">
        <h2 className="text-sm text-slate-500">{title}</h2>

        <p className="text-3xl font-semibold text-[var(--primary)] mt-2">
          {value}
        </p>
      </div>
    </Link>
  );
}

export default function Dashboard() {

  const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      
      const res = await api.get("/dashboard/dashboard_data");

      setDashboardData(res.data);

      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {dashboardData.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={loading ? "Loading..." : item.count}
          link={item.link}
        />
      ))}
    </div>
  );
}