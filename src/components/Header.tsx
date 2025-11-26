"use client"

import * as React from "react"
import { SidebarTrigger } from "./ui/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function Header() {
  return (
    <header className="w-full border-b bg-background/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger />
          <p className="text-sm font-medium ml-5">General Ledger</p>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
