import axios from "axios";
import { jwtDecode } from "jwt-decode";


const baseUrl = import.meta.env.VITE_API_BASE_URL;


const axios_api = axios.create({
  baseURL: baseUrl,
});

axios_api.interceptors.request.use(
  async (config) => {
    let access = localStorage.getItem("access_token");

    if (access) {
      const decoded = jwtDecode(access);
      const exp = decoded.exp;

      if (exp < Date.now() / 1000) {
        // token expired, try refresh
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh){
          window.location.href = "/login";
          return Promise.reject("No refresh token available");
        }
        try {
          const res = await axios.post(`${baseUrl}/api/token/refresh/`, {
            refresh,
          });
          const newAccess = res.data.access;
          localStorage.setItem("access_token", newAccess);
          access = newAccess;
        } catch (err) {
          console.log("Token refresh failed, maybe redirect to login");
          window.location.href = "/login"
        }
      }

      config.headers["Authorization"] = `Bearer ${access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axios_api;
