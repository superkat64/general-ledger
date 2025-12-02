"use client";

export default function DashboardPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <h1 className="text-4xl font-bold text-center sm:text-left">🚧 Dashboard 🚧</h1>
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
