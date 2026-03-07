import { PlaidProvider, usePlaid } from './PlaidContext';
import PlaidLinkButton from './PlaidLinkButton';
import Transactions from './components/Transactions';
import Balance from './components/Balance';
import './App.css';

function AppContent() {
  const { isLinked, linkError, backendOk } = usePlaid();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◆</span>
            <h1>Plaid Demo</h1>
          </div>
        </div>
      </header>

      <main className="main">
        {!isLinked ? (
          <section className="hero">
            <h2>Connect your bank account</h2>
            <p className="hero-text">
              Securely link your bank to view transactions and balances. Powered by Plaid.
            </p>
            {!backendOk && (
              <div className="alert alert-warning">
                Cannot reach backend. Ensure the quickstart server is running on{' '}
                <code>localhost:8000</code> with your Plaid credentials in <code>.env</code>.
              </div>
            )}
            {linkError && backendOk && (
              <div className="alert alert-error">{linkError}</div>
            )}
            <div className="hero-actions">
              <PlaidLinkButton />
            </div>
          </section>
        ) : (
          <div className="dashboard">
            <div className="dashboard-header">
              <h2>Your finances</h2>
              <span className="badge-success">Bank connected</span>
            </div>
            <div className="cards-grid">
              <Balance />
              <Transactions />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Uses the Plaid Quickstart backend · Not for production use</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <PlaidProvider>
      <AppContent />
    </PlaidProvider>
  );
}

export default App;
