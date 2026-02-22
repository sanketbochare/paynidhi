// backend/src/utils/avatar.utils.js

// These should exist in frontend public or served from backend static.
// For simplicity, we serve from backend /uploads/defaults, but you can change.
export const RANDOM_AVATARS = [
  "/uploads/avatars/avatar-1.png",
  "/uploads/avatars/avatar-1.png",
  "/uploads/avatars/avatar-1.png",
  "/uploads/avatars/avatar-1.png",
  
];

export const getRandomAvatarUrl = () => {
  const idx = Math.floor(Math.random() * RANDOM_AVATARS.length);
  return RANDOM_AVATARS[idx];
};
