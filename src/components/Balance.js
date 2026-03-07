import { useState } from 'react';
import { fetchBalance } from '../api';

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

export default function Balance() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBalance();
      setAccounts(data.accounts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const total = accounts.reduce((sum, a) => sum + (a.balances?.current || 0), 0);

  return (
    <section className="card balance-card">
      <div className="card-header">
        <h2>Account balances</h2>
        <button className="btn-secondary" onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh balances'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {accounts.length === 0 && !loading && !error && (
        <p className="muted">Click &quot;Refresh balances&quot; to load your account balances.</p>
      )}
      {accounts.length > 0 && (
        <>
          <div className="balance-total">
            <span className="balance-label">Total balance</span>
            <span className="balance-value">{formatCurrency(total)}</span>
          </div>
          <ul className="account-list">
            {accounts.map((a) => (
              <li key={a.account_id} className="account-item">
                <div>
                  <span className="account-name">{a.name}</span>
                  <span className="account-type">{a.type} · {a.subtype}</span>
                </div>
                <span className="account-balance">{formatCurrency(a.balances?.current || 0)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
