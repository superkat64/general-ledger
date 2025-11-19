"use client";
import { useState } from "react";

export default function TransactionForm() {
  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Select category</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
      </select>
      <input name="note" placeholder="Optional note" value={form.note} onChange={handleChange} />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        Add transaction
      </button>
    </form>
  );
}
