export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">{children}</main>
    </div>
  );
}
