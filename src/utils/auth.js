export const API_BASE = "https://jobs.mpdatahub.com/api";

export const saveAuth = (data) => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", JSON.stringify(data.user || data));
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
  }
};

export const logout = () => {
  localStorage.clear();
};
