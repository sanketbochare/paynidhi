// example: frontend/src/api/sellerApi.js
import { getAuthToken } from "./tokenHelper";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const getSellerProfile = async () => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/seller/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw await res.json();
  return res.json();
};
