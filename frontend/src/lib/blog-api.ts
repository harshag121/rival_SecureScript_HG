import { apiClient } from './api-client';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface CreateBlogData {
  title: string;
  content: string;
  isPublished?: boolean;
  summary?: string;
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  isPublished?: boolean;
  summary?: string;
}

export const blogApi = {
  create: async (data: CreateBlogData): Promise<Blog> => {
    const res = await apiClient.post('/blogs', data);
    return res.data;
  },

  getAll: async (): Promise<Blog[]> => {
    const res = await apiClient.get('/blogs');
    return res.data;
  },

  getOne: async (id: string): Promise<Blog> => {
    const res = await apiClient.get(`/blogs/${id}`);
    return res.data;
  },

  update: async (id: string, data: UpdateBlogData): Promise<Blog> => {
    const res = await apiClient.patch(`/blogs/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete(`/blogs/${id}`);
    return res.data;
  },
};

export interface FeedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const publicApi = {
  getFeed: async (page = 1, limit = 10): Promise<{ data: Blog[]; meta: FeedMeta }> => {
    const res = await apiClient.get(`/public/feed?page=${page}&limit=${limit}`);
    return res.data;
  },

  getBlogBySlug: async (slug: string): Promise<Blog> => {
    const res = await apiClient.get(`/public/blogs/${slug}`);
    return res.data;
  },
};

export const likeApi = {
  like: async (blogId: string): Promise<{ liked: boolean; likeCount: number }> => {
    const res = await apiClient.post(`/blogs/${blogId}/like`);
    return res.data;
  },

  unlike: async (blogId: string): Promise<{ liked: boolean; likeCount: number }> => {
    const res = await apiClient.delete(`/blogs/${blogId}/like`);
    return res.data;
  },

  getStatus: async (blogId: string): Promise<{ liked: boolean; likeCount: number }> => {
    const res = await apiClient.get(`/blogs/${blogId}/like/status`);
    return res.data;
  },
};

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

export const commentApi = {
  create: async (blogId: string, content: string): Promise<Comment> => {
    const res = await apiClient.post(`/blogs/${blogId}/comments`, { content });
    return res.data;
  },

  getAll: async (blogId: string, page = 1): Promise<{ data: Comment[]; meta: FeedMeta }> => {
    const res = await apiClient.get(`/blogs/${blogId}/comments?page=${page}`);
    return res.data;
  },
};
