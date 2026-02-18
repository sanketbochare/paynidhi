// frontend/src/api/authApi.js
const API_BASE_URL = "http://localhost:5001/api"; // hard-code for now

export const registerSeller = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/register-seller`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const loginSeller = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/login-seller`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const registerLender = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/register-lender`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const loginLender = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/login-lender`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const getMe = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { _id, email, companyName?, role }
};