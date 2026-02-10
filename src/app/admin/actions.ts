'use server';

import { redirect } from 'next/navigation';

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function loginAction(_prevState: LoginResult, formData: FormData): Promise<LoginResult> {
  // Auth disabled - redirect directly
  redirect('/admin/dashboard');
}

export async function logoutAction(): Promise<void> {
  redirect('/admin/dashboard');
}
