"use client";

import { Menu, User } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-black">
      <h1 className="text-primary text-2xl font-bold">LITEFLIX</h1>
      <div className="flex items-center gap-4">
        <User className="text-white" />
        <Menu className="text-white" />
      </div>
    </header>
  );
}
