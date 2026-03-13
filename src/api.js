const API_BASE = '';

function getErrorMessage(data, fallback) {
  if (!data?.error) return fallback;
  const e = data.error;
  const msg = e.display_message || e.error_message || fallback;
  const code = e.error_code ? ` (${e.error_code})` : '';
  return `${msg}${code}`;
}

async function fetchJson(url, options, fallbackError) {
  const res = await fetch(url, options);
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(res.ok ? fallbackError : `Request failed (${res.status})`);
  }
  if (data?.error) throw new Error(getErrorMessage(data, fallbackError));
  return data;
}

export async function getInfo() {
  const res = await fetch(`${API_BASE}/api/info`, { method: 'POST' });
  if (!res.ok) throw new Error('Backend unavailable');
  return res.json();
}

export async function createLinkToken() {
  const res = await fetch(`${API_BASE}/api/create_link_token`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to create link token');
  const data = await res.json();
  if (data.error) throw new Error(data.error.error_message || 'Link token error');
  return data.link_token;
}

export async function setAccessToken(publicToken) {
  const res = await fetch(`${API_BASE}/api/set_access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: `public_token=${encodeURIComponent(publicToken)}`,
  });
  if (!res.ok) throw new Error('Failed to exchange token');
  return res.json();
}

export async function fetchTransactions() {
  return fetchJson(`${API_BASE}/api/transactions`, { method: 'GET' }, 'Failed to fetch transactions');
}

export async function fetchBalance() {
  return fetchJson(`${API_BASE}/api/balance`, { method: 'GET' }, 'Failed to fetch balance');
}

export async function fetchCustomBalances() {
  const res = await fetch(`${API_BASE}/api/custom_balances`, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch custom balances');
  const data = await res.json();
  return data.custom_balances || [];
}

export async function addCustomBalance({ name, amount, currency = 'USD' }) {
  const res = await fetch(`${API_BASE}/api/custom_balances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, amount: parseFloat(amount) || 0, currency }),
  });
  if (!res.ok) throw new Error('Failed to add custom balance');
  const data = await res.json();
  return data.custom_balances || [];
}

export async function deleteCustomBalance(id) {
  const res = await fetch(`${API_BASE}/api/custom_balances/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete custom balance');
  const data = await res.json();
  return data.custom_balances || [];
}

export async function fetchAccounts() {
  return fetchJson(`${API_BASE}/api/accounts`, { method: 'GET' }, 'Failed to fetch accounts');
}

export async function fetchAssets() {
  return fetchJson(`${API_BASE}/api/assets`, { method: 'GET' }, 'Failed to fetch assets');
}

export async function fetchInvestmentTransactions() {
  return fetchJson(
    `${API_BASE}/api/investments_transactions`,
    { method: 'GET' },
    'Failed to fetch investment transactions'
  );
}
