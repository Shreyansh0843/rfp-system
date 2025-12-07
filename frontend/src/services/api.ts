const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class APIError extends Error {
  constructor(public status: number, message: string, public errors?: any[]) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.error || 'API Error', data.errors);
  }

  return data;
}

// Vendor API
export const vendorAPI = {
  getAll: (params?: Record<string, string>) => 
    fetchAPI<{ success: boolean; data: any[]; pagination: any }>('/vendors', { params }),
  
  getById: (id: string) => 
    fetchAPI<{ success: boolean; data: any }>(`/vendors/${id}`),
  
  create: (data: any) => 
    fetchAPI<{ success: boolean; data: any; message: string }>('/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) => 
    fetchAPI<{ success: boolean; data: any; message: string }>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    fetchAPI<{ success: boolean; message: string }>(`/vendors/${id}`, {
      method: 'DELETE',
    }),
  
  getStats: () => 
    fetchAPI<{ success: boolean; data: any }>('/vendors/stats'),
};

// RFP API
export const rfpAPI = {
  getAll: (params?: Record<string, string>) => 
    fetchAPI<{ success: boolean; data: any[]; pagination: any }>('/rfps', { params }),
  
  getById: (id: string) => 
    fetchAPI<{ success: boolean; data: any }>(`/rfps/${id}`),
  
  create: (data: any) => 
    fetchAPI<{ success: boolean; data: any; message: string }>('/rfps', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  createFromAI: (input: string, deadline?: string) => 
    fetchAPI<{ success: boolean; data: any; aiSuggestions: any; message: string }>('/rfps/ai-create', {
      method: 'POST',
      body: JSON.stringify({ input, deadline }),
    }),
  
  update: (id: string, data: any) => 
    fetchAPI<{ success: boolean; data: any; message: string }>(`/rfps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    fetchAPI<{ success: boolean; message: string }>(`/rfps/${id}`, {
      method: 'DELETE',
    }),
  
  sendToVendors: (id: string, vendorIds: string[], customMessage?: string) =>
    fetchAPI<{ success: boolean; data: any; message: string }>(`/rfps/${id}/send`, {
      method: 'POST',
      body: JSON.stringify({ vendorIds, customMessage }),
    }),
  
  getAISuggestions: (category: string, description: string) =>
    fetchAPI<{ success: boolean; data: any }>('/rfps/ai-suggestions', {
      method: 'POST',
      body: JSON.stringify({ category, description }),
    }),
  
  getStats: () => 
    fetchAPI<{ success: boolean; data: any }>('/rfps/stats'),
};

// Proposal API
export const proposalAPI = {
  getAll: (params?: Record<string, string>) => 
    fetchAPI<{ success: boolean; data: any[]; pagination: any }>('/proposals', { params }),
  
  getByRFP: (rfpId: string) => 
    fetchAPI<{ success: boolean; data: any[] }>(`/proposals/rfp/${rfpId}`),
  
  getById: (id: string) => 
    fetchAPI<{ success: boolean; data: any }>(`/proposals/${id}`),
  
  create: (data: any) => 
    fetchAPI<{ success: boolean; data: any; message: string }>('/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) => 
    fetchAPI<{ success: boolean; data: any; message: string }>(`/proposals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updateStatus: (id: string, status: string) =>
    fetchAPI<{ success: boolean; data: any; message: string }>(`/proposals/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  delete: (id: string) => 
    fetchAPI<{ success: boolean; message: string }>(`/proposals/${id}`, {
      method: 'DELETE',
    }),
  
  analyze: (id: string) => 
    fetchAPI<{ success: boolean; data: any }>(`/proposals/${id}/analyze`, {
      method: 'POST',
    }),
  
  compare: (rfpId: string, proposalIds?: string[]) =>
    fetchAPI<{ success: boolean; data: any }>(`/proposals/compare/${rfpId}`, {
      method: 'POST',
      body: JSON.stringify({ proposalIds }),
    }),
  
  getStats: (rfpId?: string) => 
    fetchAPI<{ success: boolean; data: any }>('/proposals/stats', {
      params: rfpId ? { rfpId } : undefined,
    }),
};

export { APIError };
