// components/institution-form.tsx
"use client"
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { createInstitution, updateInstitution } from "@/app/institutions/actions";

import type { institution } from '@prisma/client';


export default function InstitutionForm({ institution }: { institution?: institution }) {
  const router = useRouter();
  const [name, setName] = useState<string>(institution?.name ?? "");
  const [color, setColor] = useState<string>(institution?.color ?? "");
  const [lastFourDigits, setLastFourDigits] = useState<string>(institution?.last_four_digits ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (color) formData.append('color', color);
    if (lastFourDigits) formData.append('last_four_digits', lastFourDigits);

    startTransition(async () => {
      try {
        if (institution?.id) {
          formData.append('id', institution.id);
          await updateInstitution(formData);
        } else {
          await createInstitution(formData);
        }
        router.push("/institutions");
      } catch (error) {
        alert("Failed to save institution. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <div className="flex flex-row gap-5">
        <div className="w-full">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" name="name" value={name} onChange={e => setName(e.currentTarget.value)} required />
        </div>
        <div className="w-full">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="text"
            name="color"
            value={color}
            onChange={e => setColor(e.currentTarget.value)}
            pattern="^#?[0-9A-Fa-f]{6}$"
            placeholder="#RRGGBB" />
        </div>
      </div>
      <div>
        <Label htmlFor="lastFourDigits">Last Four Digits of Card - if applicable</Label>
        <Input
          id="lastFourDigits"
          type="text"
          name="lastFourDigits"
          value={lastFourDigits}
          onChange={e => setLastFourDigits(e.currentTarget.value)}
          pattern="[0-9]{4}"
          maxLength={4}
          placeholder="1234" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Institution"}
      </Button>
    </form>
  )
}