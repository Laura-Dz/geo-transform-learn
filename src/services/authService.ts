import bcrypt from 'bcryptjs'; // Keep for future if needed

export async function signup(name: string, email: string, password: string) {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export const validateToken = async (token: string) => {
  const response = await fetch("/api/auth/validate", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Invalid token");
  return await response.json();
};