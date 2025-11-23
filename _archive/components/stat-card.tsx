import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  children?: ReactNode;
}

export default function StatCard({ title, value, icon, children }: StatCardProps) {
  return (
    <div className="bg-bg-card-dashboard border border-border-dashboard rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs uppercase font-semibold text-text-muted-dashboard tracking-wider">
          {title}
        </div>
        <div className="text-text-muted-dashboard">{icon}</div>
      </div>
      <div className="font-display text-4xl font-semibold text-text-main-dashboard mb-2">
        {value}
      </div>
      {children}
    </div>
  );
}
