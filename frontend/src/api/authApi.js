// frontend/src/api/authApi.js
const API_BASE_URL = "http://localhost:5001/api"; // adjust for prod

const handleJson = async (res) => {
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const registerSeller = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/register-seller`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleJson(res);
};

export const loginSeller = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/login-seller`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleJson(res);
};

export const registerLender = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/register-lender`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleJson(res);
};

export const loginLender = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/login-lender`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleJson(res);
};

export const getMe = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  return handleJson(res); // { _id, email, companyName?, role, avatarUrl? }
};

export const updateAvatar = async (avatarUrl) => {
  const res = await fetch(`${API_BASE_URL}/auth/avatar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ avatarUrl }),
  });
  return handleJson(res);
};

export const requestOtp = async ({ email, purpose }) => {
  const res = await fetch(`${API_BASE_URL}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, purpose }),
  });
  return handleJson(res);
};

export const verifyOtp = async (body) => {
  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    credentials: "include",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  });

  return handleJson(res);
};