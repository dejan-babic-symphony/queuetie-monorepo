import axios from 'axios';

const headers = {
  accept: 'application/json',
  'Content-type': 'application/json',
};

const dispatcherClient = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVICE_API_URL ?? 'http://localhost:4000',
  headers,
});

export default { dispatcherClient };
