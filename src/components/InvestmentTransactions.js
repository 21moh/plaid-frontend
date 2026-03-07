import { useState } from 'react';
import { fetchInvestmentTransactions } from '../api';

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

export default function InvestmentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInvestmentTransactions();
      const invData = data.investments_transactions;
      const txs = invData?.investment_transactions || [];
      const securities = invData?.securities || [];
      const secMap = Object.fromEntries(
        securities.map((s) => [s.security_id, s])
      );
      const enriched = txs
        .map((t) => ({
          ...t,
          securityName: secMap[t.security_id]?.name || 'Unknown',
        }))
        .sort((a, b) => (a.date > b.date ? -1 : 1));
      setTransactions(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card investment-transactions-card">
      <div className="card-header">
        <h2>Investment transactions</h2>
        <button className="btn-secondary" onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Load investments'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {transactions.length === 0 && !loading && !error && (
        <p className="muted">
          Click &quot;Load investments&quot; to fetch investment transactions from the last 30 days.
          <span className="muted-hint">
            {' '}Requires <code>investments</code> in PLAID_PRODUCTS and a re-linked account.
          </span>
        </p>
      )}
      {transactions.length > 0 && (
        <ul className="transaction-list">
          {transactions.map((t) => (
            <li key={t.investment_transaction_id} className="transaction-item">
              <div className="transaction-main">
                <span className="transaction-name">{t.securityName}</span>
                <span className={`transaction-amount ${t.amount < 0 ? 'negative' : ''}`}>
                  {formatCurrency(t.amount, t.iso_currency_code)}
                </span>
              </div>
              <span className="transaction-date">
                {t.date} · {t.subtype || t.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
