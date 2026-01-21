'use client';

import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn } from 'lucide-react';
import { Suspense } from 'react';

function AuthButtonContent() {
  const user = useUser();
  if (!user) {
    return (
      <Button asChild variant="default" className="w-full">
        <Link href="/handler/sign-in" className="flex items-center gap-2">
          <LogIn size={16} />
          Sign In
        </Link>
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={() => user?.signOut()}
    >
      <LogOut size={16} />
      Sign Out
    </Button>
  );
}

export function AuthButton() {
  return (
    <Suspense fallback={
      <Button variant="outline" className="w-full" disabled>
        Loading...
      </Button>
    }>
      <AuthButtonContent />
    </Suspense>
  );
}