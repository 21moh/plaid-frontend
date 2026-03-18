import { useState } from 'react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import { fetchTransactions } from '../api';

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

function aggregateByDay(transactions) {
  const map = new Map(); // date -> total
  for (const t of transactions || []) {
    const date = t?.date;
    const amount = t?.amount;
    if (!date || typeof amount !== 'number') continue;
    map.set(date, (map.get(date) || 0) + amount);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
    .map(([date, total]) => ({ date, total }));
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

  const dailyTotals = aggregateByDay(transactions);

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
        <>
          {dailyTotals.length > 0 && (
            <div className="transactions-chart">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dailyTotals} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <ReferenceLine y={0} stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={{ stroke: 'var(--border)' }}
                    tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${Math.round(v / 100) / 10}k` : v)}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                    }}
                  />
                  <Bar dataKey="total" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

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
        </>
      )}
    </section>
  );
}
