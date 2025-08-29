import { api, setAccessToken } from "../api/http";

export const AuthController = {
  async login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.accessToken);
    return res.user;
  },

  async register({ name, email, password }) {
    const res = await api.post("/auth/registration", { name, email, password });
    setAccessToken(res.accessToken);
    return res.user;
  },

  async logout() {
    await api.post("/auth/logout");
    setAccessToken(null);
  },

  async forgot(email) {
    return api.post("/auth/forgot", { email });
  },

  async reset(token, password) {
    return api.post("/auth/reset", { token, password });
  },
};
