const API_BASE = '';

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
  const res = await fetch(`${API_BASE}/api/transactions`, { method: 'GET' });
  const data = await res.json();
  if (data.error) throw new Error(data.error.display_message || 'Failed to fetch transactions');
  return data;
}

export async function fetchBalance() {
  const res = await fetch(`${API_BASE}/api/balance`, { method: 'GET' });
  const data = await res.json();
  if (data.error) throw new Error(data.error.display_message || 'Failed to fetch balance');
  return data;
}

export async function fetchAccounts() {
  const res = await fetch(`${API_BASE}/api/accounts`, { method: 'GET' });
  const data = await res.json();
  if (data.error) throw new Error(data.error.display_message || 'Failed to fetch accounts');
  return data;
}
