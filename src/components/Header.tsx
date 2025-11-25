"use client"

import * as React from "react"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function Header() {
  return (
    <header className="w-full border-b bg-background/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-medium">General Ledger</div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
