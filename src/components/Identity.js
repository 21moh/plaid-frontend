import { useState } from 'react';
import { fetchIdentity } from '../api';

export default function Identity() {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIdentity();
      setIdentity(data.identity || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const owners = identity?.flatMap((acc) => acc.owners || []) || [];
  const uniqueOwners = owners.filter(
    (o, i, arr) => arr.findIndex((x) => JSON.stringify(x) === JSON.stringify(o)) === i
  );

  return (
    <section className="card identity-card">
      <div className="card-header">
        <h2>Identity</h2>
        <button className="btn-secondary" onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Load identity'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {(!identity || identity.length === 0) && !loading && !error && (
        <p className="muted">
          Click &quot;Load identity&quot; to retrieve name, address, email, and phone from your linked accounts.
          <span className="muted-hint"> Requires <code>identity</code> in PLAID_PRODUCTS.</span>
        </p>
      )}
      {uniqueOwners.length > 0 && (
        <div className="identity-grid">
          {uniqueOwners.map((owner, idx) => (
            <div key={idx} className="identity-panel">
              <h3 className="identity-panel-title">Account holder</h3>
              <dl className="identity-dl">
                <dt>Names</dt>
                <dd>{(owner.names || []).join(', ') || '—'}</dd>
                <dt>Emails</dt>
                <dd>{(owner.emails || []).map((e) => e?.data).filter(Boolean).join(', ') || '—'}</dd>
                <dt>Phones</dt>
                <dd>{(owner.phone_numbers || []).map((p) => p?.data).filter(Boolean).join(', ') || '—'}</dd>
                <dt>Addresses</dt>
                <dd>
                  {(owner.addresses || []).map((a) => {
                    const d = a?.data || {};
                    return [d.street, d.city, d.region, d.postal_code, d.country].filter(Boolean).join(', ');
                  }).filter(Boolean).join(' | ') || '—'}
                </dd>
              </dl>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
