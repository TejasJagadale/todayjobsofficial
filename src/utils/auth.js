export const API_BASE = "https://jobs.mpdatahub.com/api";

export const saveAuth = (data) => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", JSON.stringify(data.user || data));
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
};

export const logout = () => {
  localStorage.clear();
};
