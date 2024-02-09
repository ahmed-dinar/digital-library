import axios from 'axios';

export const coreAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CORE_API_URL,
  timeout: parseInt(process.env.NEXT_PUBLIC_CORE_API_TIMEOUT as string, 10),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'authorization',
  },
});

// Add a response interceptor
coreAxios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Log the error globally
  console.error('Axios response error:', error);
  // Do something with the response error
  return Promise.reject(error);
});