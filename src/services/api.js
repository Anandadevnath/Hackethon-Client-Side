let API_BASE = '';
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
  API_BASE = import.meta.env.VITE_API_BASE;
} else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  API_BASE = 'https://hackethon-server-side-production.up.railway.app';
} else {
  API_BASE = '';
}

async function request(path, { method = 'GET', headers = {}, body, params, credentials = true, ...opts } = {}) {
  const p = path && path.startsWith('/') ? path : `/${path || ''}`;
  let url = `${API_BASE}${p}`;
  if (params && typeof params === 'object') {
    const q = new URLSearchParams(params).toString();
    if (q) url += `?${q}`;
  }

  const fetchOpts = { method, headers: { ...headers }, credentials: credentials ? 'include' : 'same-origin', ...opts };
  if (body !== undefined) {
    if (body instanceof FormData) {
      fetchOpts.body = body;
    } else if (typeof body === 'object') {
      fetchOpts.headers = { 'Content-Type': 'application/json', ...fetchOpts.headers };
      fetchOpts.body = JSON.stringify(body);
    } else {
      fetchOpts.body = body;
    }
  }

  const res = await fetch(url, fetchOpts);
  const text = await res.text().catch(() => '');
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = text;
  }
  return { ok: res.ok, status: res.status, data, res };
}

const get = (path, opts) => request(path, { ...opts, method: 'GET' });
const post = (path, body, opts) => request(path, { ...opts, method: 'POST', body });
const put = (path, body, opts) => request(path, { ...opts, method: 'PUT', body });
const patch = (path, body, opts) => request(path, { ...opts, method: 'PATCH', body });
const del = (path, opts) => request(path, { ...opts, method: 'DELETE' });

export default {
  API_BASE,
  request,
  get,
  post,
  put,
  patch,
  del,
};
