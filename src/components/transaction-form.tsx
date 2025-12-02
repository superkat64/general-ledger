// components/transaction-form.tsx
"use client";
import React, { useState, useTransition, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { createTransaction, updateTransaction } from "@/app/transactions/actions";
import { getCategoriesWithSubcategories } from "@/app/categories/actions";
import { TransactionWithRels, CategoryWithSubs } from "@/lib/types";
import { subcategory } from "@prisma/client";

export default function TransactionForm({ transaction }: { transaction?: TransactionWithRels }) {

  // Transaction attributes
  const [transactionDate, setTransactionDate] = useState<string>(
    transaction
      ? new Date(transaction.transaction_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [amount, setAmount] = useState<string>(
    transaction ? transaction.amount?.toString() ?? "0.00" : "0.00"
  );
  const [transactionType, setTransactionType] = useState<string>(
    transaction ? transaction.transaction_type : ""
  );
  const [description, setDescription] = useState<string>(
    transaction ? transaction.description ?? "" : ""
  );
  const [subcategoryId, setSubcategoryId] = useState<string>(
    transaction ? transaction.subcategory?.id ?? "" : ""
  );

  // Category state
  const [categoryId, setCategoryId] = useState<string>(
    transaction ? transaction.subcategory?.category_id ?? "" : ""
  );
  const [subcategories, setSubcategories] = useState<subcategory[]>([]);
  const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
  const [isPending, startTransition] = useTransition();

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      const cats = await getCategoriesWithSubcategories();
      setCategories(cats);

      // If editing, populate subcategories for the existing category
      if (transaction?.subcategory?.category_id) {
        const existingCategory = cats.find(c => c.id === transaction.subcategory?.category_id);
        if (existingCategory) {
          setSubcategories(existingCategory.subcategory);
        }
      }
    }
    loadCategories();
  }, []);

  const changeCategories = (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    const selectedCategory = categories.find(c => c.id === newCategoryId);
    setSubcategories(selectedCategory?.subcategory || []);
    setSubcategoryId(""); // Reset subcategory when category changes
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("transaction_date", transactionDate);
    formData.append("amount", amount.toString());
    formData.append("transaction_type", transactionType);
    if (description) formData.append("description", description);
    if (subcategoryId) formData.append("subcategory_id", subcategoryId);

    startTransition(() => {
      if (transaction?.id) {
        formData.append("id", transaction.id);
        updateTransaction(formData);
      } else {
        createTransaction(formData);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-row items-center">
        <Label htmlFor="date" className="pr-3">Date:</Label>
        <Input
          type="date"
          className="w-fit"
          name="transaction_date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.currentTarget.value)}
          required
        />
      </div>
      <div className="flex flex-row gap-6 justify-between">
        <div className="w-full">
          <Label htmlFor="amount">Amount</Label>
          <Input
            type="number"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
            step="0.01"
            required
          />
        </div>
        <div className="w-full">
          <Label htmlFor="transaction_type">Type</Label>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-row gap-6 justify-between">
        <div className="w-full">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={changeCategories}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={subcategoryId}
            onValueChange={setSubcategoryId}
            disabled={subcategories.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map(sub => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </div>


      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Transaction"}
      </Button>
    </form>
  );
}