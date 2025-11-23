'use client';

import { PlusCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const today = new Date();
    setFormattedDate(today.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <header className="flex justify-between items-end mb-8">
      <div>
        <h1 className="font-display text-2xl text-text-main-dashboard">
          Welcome, Artist. {/* Replaced with static text */}
        </h1>
        <div className="text-sm text-text-muted-dashboard mt-1">{formattedDate}</div>
      </div>
      <button className="flex items-center gap-2 bg-text-main-dashboard text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-auth-accent-dark transition-colors">
        <PlusCircle size={20} />
        Upload New Work
      </button>
    </header>
  );
}
