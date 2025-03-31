'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const error = searchParams.get('error');
    
    // Map error codes to user-friendly messages
    if (error === 'CredentialsSignin') {
      setErrorMessage('Invalid email or password. Please try again.');
    } else if (error === 'AccessDenied') {
      setErrorMessage('Access denied. You do not have permission to access this resource.');
    } else if (error === 'OAuthSignin' || error === 'OAuthCallback' || error === 'OAuthCreateAccount') {
      setErrorMessage('There was a problem with the authentication service. Please try again.');
    } else if (error === 'EmailCreateAccount' || error === 'Callback' || error === 'EmailSignin') {
      setErrorMessage('There was a problem with the email sign-in. Please try again.');
    } else if (error === 'SessionRequired') {
      setErrorMessage('You must be signed in to access this page.');
    } else {
      setErrorMessage('An unknown error occurred. Please try again.');
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Authentication Error</h1>
          <div className="mt-4 rounded-md bg-destructive/15 p-4">
            <div className="text-sm font-medium text-destructive">{errorMessage}</div>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}