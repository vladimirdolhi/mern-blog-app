import { api } from "../api/http";

export const BlogController = {
  list: ({
    search = "",
    from = "",
    to = "",
    sort = "date_desc",
    page = 1,
    limit = 50,
  } = {}) =>
    api.get(
      `/blogs?` +
        new URLSearchParams({
          ...(search ? { search } : {}),
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
          sort,
          page: String(page),
          limit: String(limit),
        }).toString()
    ),

  get: (id) => api.get(`/blogs/${id}`),

  create: ({ title, body }) => api.post("/blogs", { title, body }),

  update: (id, { title, body }) => api.put(`/blogs/${id}`, { title, body }),

  remove: (id) => api.del(`/blogs/${id}`),
};
