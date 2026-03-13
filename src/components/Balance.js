import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { fetchBalance } from '../api';

const CHART_COLORS = [
  '#00d4aa', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c', '#e91e63', '#00bcd4',
];

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
  const chartData = accounts
    .map((a) => ({
      name: a.name,
      value: Math.max(0, a.balances?.current ?? 0),
    }))
    .filter((d) => d.value > 0);

  const hasChartData = chartData.length > 0;

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
          {hasChartData && (
            <div className="balance-chart">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="var(--border)"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                    }}
                  />
                  <Legend
                    formatter={(value, { payload }) =>
                      `${value} (${formatCurrency(payload?.value ?? 0)})`
                    }
                    wrapperStyle={{ fontSize: '0.85rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
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
