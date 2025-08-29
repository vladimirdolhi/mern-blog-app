import { api } from "../api/http";

export const RatingController = {
  summary: (blogId) => api.get(`/ratings/${blogId}/summary`),

  mine: (blogId) => api.get(`/ratings/${blogId}/me`),

  rate: (blogId, value) => api.post(`/ratings/${blogId}`, { value }),
};
