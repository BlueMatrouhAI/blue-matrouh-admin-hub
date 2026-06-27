let accessToken: string | null = null
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM5NjJlYzdkNDQyNjYwY2VmZjhkNWEiLCJlbWFpbCI6Im9tYXJlbHNoYXJpZjk2QGdtYWlsLmNvbSIsImlzU2VsbGVyIjpmYWxzZSwicm9sZSI6ImFkbWluIiwic3RhdHVzIjoiVW52ZXJpZmllZCIsImlhdCI6MTc4MjUzODM0MiwiZXhwIjoxNzgyNjI0NzQyfQ.2VVyQyd9vjOHH1jZVOhOwHUGxvlyyez-fwhyVNH0tuk";

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};
