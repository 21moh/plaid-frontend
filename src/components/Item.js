import { useState } from 'react';
import { fetchItem } from '../api';

export default function Item() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchItem();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const item = data?.item || {};
  const institution = data?.institution || {};

  return (
    <section className="card item-card">
      <div className="card-header">
        <h2>Connected institution</h2>
        <button className="btn-secondary" onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Load item info'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {!data && !loading && !error && (
        <p className="muted">Click &quot;Load item info&quot; to see which institution is connected and available products.</p>
      )}
      {data && (
        <div className="item-panel">
          <div className="item-institution">
            {institution.logo && (
              <img src={institution.logo} alt="" className="item-logo" />
            )}
            <h3 className="item-name">{institution.name || 'Unknown institution'}</h3>
          </div>
          <dl className="item-dl">
            <dt>Item ID</dt>
            <dd className="item-dd">{item.item_id || '—'}</dd>
            <dt>Available products</dt>
            <dd>{(item.available_products || []).join(', ') || '—'}</dd>
            <dt>Billed products</dt>
            <dd>{(item.billed_products || []).join(', ') || '—'}</dd>
          </dl>
        </div>
      )}
    </section>
  );
}
