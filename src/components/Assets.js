import { useState } from 'react';
import { fetchAssets } from '../api';

function formatCurrency(amount, currency = 'USD') {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

export default function Assets() {
  const [items, setItems] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssets();
      const assetItems = data.json?.items || [];
      const flatItems = assetItems.flatMap((item) =>
        item.accounts.map((account) => ({
          name: account.name,
          balance: account.balances?.available ?? account.balances?.current,
          currency: account.balances?.iso_currency_code,
          transactions: account.transactions?.length ?? 0,
          daysAvailable: account.days_available,
        }))
      );
      setItems(flatItems);
      setPdf(data.pdf || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card assets-card">
      <div className="card-header">
        <h2>Asset report</h2>
        <button className="btn-secondary" onClick={load} disabled={loading}>
          {loading ? 'Generating...' : 'Get asset report'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {items.length === 0 && !loading && !error && (
        <p className="muted">
          Click &quot;Get asset report&quot; to create a 60-day asset report. This may take a moment.
          <span className="muted-hint">
            {' '}Requires <code>assets</code> in PLAID_PRODUCTS and a re-linked account.
          </span>
        </p>
      )}
      {items.length > 0 && (
        <>
          <ul className="account-list">
            {items.map((item, idx) => (
              <li key={idx} className="account-item">
                <div>
                  <span className="account-name">{item.name}</span>
                  <span className="account-type">
                    {item.transactions} transactions · {item.daysAvailable} days
                  </span>
                </div>
                <span className="account-balance">
                  {formatCurrency(item.balance, item.currency)}
                </span>
              </li>
            ))}
          </ul>
          {pdf && (
            <a
              href={`data:application/pdf;base64,${pdf}`}
              download="Asset Report.pdf"
              className="btn-secondary btn-download"
            >
              Download PDF
            </a>
          )}
        </>
      )}
    </section>
  );
}
