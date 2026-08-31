/**
 * Storage Utility for Tab-Independent Sessions
 * Uses sessionStorage as primary storage to allow concurrent login sessions across multiple browser tabs
 * (e.g. Student in Tab 1, Teacher in Tab 2).
 */

export const getItem = (key) => {
  try {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.error('Failed to set sessionStorage item:', e);
  }
};

export const removeItem = (key) => {
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove storage item:', e);
  }
};

export const clearSession = () => {
  try {
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentGrade');
    localStorage.removeItem('masteryLevels');
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
};
