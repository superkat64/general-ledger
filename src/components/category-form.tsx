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

import { createCategory } from "@/app/categories/actions";
import { useTransition } from "react";

export default function CategoryForm() {
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();

  const addSubcategory = () => {
    if (inputValue.trim()) {
      setSubcategories([...subcategories, inputValue.trim()]);
      setInputValue('');
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    subcategories.forEach(sbc => {
      formData.append('subcategory', sbc);
    });
    startTransition(() => {
      createCategory(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <Label htmlFor="name">Name</Label>
      <Input type="text" name="name" required />

      <Label htmlFor="monthly_budget">Monthly Budget</Label>
      <Input type="number" name="monthly_budget" step="0.01" />

      <Label htmlFor="type">Type</Label>
      <Select>
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
      <Input type="text" name="color" />

      <Label htmlFor="icon">Icon</Label>
      <Input type="text" name="icon" />

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
        {subcategories.map((sbc, idx) => {
          return (
            <Badge key={idx}>{sbc}</Badge>
          )
        })}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Category"}
      </Button>
    </form>
  );
}