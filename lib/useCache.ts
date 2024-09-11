import { GearyoUser } from "@/src/entities/models/types";

const USER_CACHE_KEY = "gearyo_user_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface CachedUser extends GearyoUser {
  timestamp: number;
}

export const cacheUser = (user: GearyoUser) => {
  const cachedUser: CachedUser = {
    ...user,
    timestamp: Date.now(),
  };
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cachedUser));
};

export const getCachedUser = (): GearyoUser | null => {
  const cachedUserString = localStorage.getItem(USER_CACHE_KEY);
  if (!cachedUserString) return null;

  const cachedUser: CachedUser = JSON.parse(cachedUserString);
  if (Date.now() - cachedUser.timestamp > CACHE_DURATION) {
    localStorage.removeItem(USER_CACHE_KEY);
    return null;
  }

  const { timestamp, ...user } = cachedUser;
  return user;
};

export const clearUserCache = () => {
  localStorage.removeItem(USER_CACHE_KEY);
};
