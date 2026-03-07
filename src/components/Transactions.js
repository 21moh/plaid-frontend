import { useState } from 'react';
import { fetchTransactions } from '../api';

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions();
      setTransactions(data.latest_transactions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card transactions-card">
      <div className="card-header">
        <h2>Recent transactions</h2>
        <button className="btn-secondary" onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Sync transactions'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {transactions.length === 0 && !loading && !error && (
        <p className="muted">Click &quot;Sync transactions&quot; to load your latest transactions.</p>
      )}
      {transactions.length > 0 && (
        <ul className="transaction-list">
          {transactions.map((t) => (
            <li key={t.transaction_id} className="transaction-item">
              <div className="transaction-main">
                <span className="transaction-name">{t.name || 'Unknown'}</span>
                <span className={`transaction-amount ${t.amount < 0 ? 'negative' : ''}`}>
                  {formatCurrency(t.amount, t.iso_currency_code)}
                </span>
              </div>
              <span className="transaction-date">{t.date}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
