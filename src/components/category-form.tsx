// components/category-form.tsx
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react"

import { createCategory, updateCategory } from "@/app/categories/actions";
import { useTransition } from "react";
import { useRouter } from "next/router";
import { Prisma } from '@prisma/client';

type CategoryWithRelations = Prisma.categoryGetPayload<{ include: { subcategory: true } }>;

export default function CategoryForm({ category }: { category?: CategoryWithRelations }) {
  const [name, setName] = useState<string>(category?.name ?? "");
  const [monthlyBudget, setMonthlyBudget] = useState<string>(category?.monthly_budget?.toString() ?? "");
  const [typeValue, setTypeValue] = useState<string>((category?.type as string) ?? "expense");
  const [color, setColor] = useState<string>(category?.color ?? "");
  const [icon, setIcon] = useState<string>(category?.icon ?? "");
  const router = useRouter();

  // new subcategories added during this form session (removable)
  const [newSubs, setNewSubs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();

  // existing subcategories from DB (locked from deletion in this iteration)
  const existingSubs = category?.subcategory ?? [];

  const addSubcategory = () => {
    const val = inputValue.trim();
    if (val) {
      setNewSubs((s) => [...s, val]);
      setInputValue('');
    }
  }

  const removeNewSub = (idx: number) => {
    setNewSubs((s) => s.filter((_, i) => i !== idx));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (monthlyBudget) formData.append('monthly_budget', monthlyBudget);
    formData.append('type', typeValue);
    if (color) formData.append('color', color);
    if (icon) formData.append('icon', icon);

    // include existing subcategory ids so server knows to keep them
    existingSubs.forEach((s) => formData.append('existing_subcategory_id', s.id));
    // include new subcategory names for creation
    newSubs.forEach((s) => formData.append('subcategory', s));

    startTransition(async () => {
      try {
        if (category?.id) {
          formData.append('id', category.id);
          await updateCategory(formData);
        } else {
          await createCategory(formData);
        }
        router.push('/categories');
      } catch (error) {
        console.error('Failed to save category:', error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <Label htmlFor="name">Name</Label>
      <Input type="text" name="name" value={name} onChange={(e) => setName(e.currentTarget.value)} required />

      <Label htmlFor="monthly_budget">Monthly Budget</Label>
      <Input type="number" name="monthly_budget" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.currentTarget.value)} step="0.01" />

      <Label htmlFor="type">Type</Label>
      <Select value={typeValue} onValueChange={setTypeValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="transfer">Transfer</SelectItem>
        </SelectContent>
      </Select>

      <Label htmlFor="color">Color</Label>
      <Input type="text" name="color" value={color} onChange={(e) => setColor(e.currentTarget.value)} />

      <Label htmlFor="icon">Icon</Label>
      <Input type="text" name="icon" value={icon} onChange={(e) => setIcon(e.currentTarget.value)} />

      <Label htmlFor="subcategories">Subcategories</Label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          name="subcategory"
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSubcategory();
            }
          }}
        />
        <Button
          size="icon"
          variant="outline"
          type="button"
          onClick={() => { addSubcategory() }}
        >
          <Plus />
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {existingSubs.map((s) => (
          <Badge variant="secondary" key={s.id}>{s.name}</Badge>
        ))}
        {newSubs.map((s, idx) => (
          <Badge key={`new-${idx}`} variant="secondary">
            <span className="mr-2">{s}</span>
            <button type="button" onClick={() => removeNewSub(idx)} aria-label={`Remove ${s}`} className="text-sm">×</button>
          </Badge>
        ))}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Category"}
      </Button>
    </form>
  );
}