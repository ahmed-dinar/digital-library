import axios from 'axios';

console.log('process.env.CORE_API_URL ', process.env.CORE_API_URL);

export const coreAxios = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: parseInt(process.env.CORE_API_TIMEOUT as string, 10),
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