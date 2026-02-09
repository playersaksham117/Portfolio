'use server';

import { redirect } from 'next/navigation';
import { verifyPassword, createSession, setSessionCookie, clearSessionCookie } from '@/lib/auth';

const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const record = failedAttempts.get(ip);
  if (!record) return false;
  if (Date.now() - record.lastAttempt > LOCKOUT_DURATION) {
    failedAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const record = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  record.count += 1;
  record.lastAttempt = Date.now();
  failedAttempts.set(ip, record);
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function loginAction(_prevState: LoginResult, formData: FormData): Promise<LoginResult> {
  const ip = 'client';
  
  if (isRateLimited(ip)) {
    return { success: false, error: 'Too many failed attempts. Please try again in 15 minutes.' };
  }

  const password = formData.get('password');
  if (!password || typeof password !== 'string') {
    return { success: false, error: 'Password is required' };
  }

  if (!verifyPassword(password)) {
    recordFailedAttempt(ip);
    return { success: false, error: 'Invalid password' };
  }

  clearFailedAttempts(ip);
  const token = await createSession();
  await setSessionCookie(token);
  redirect('/admin/dashboard');
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect('/admin');
}
