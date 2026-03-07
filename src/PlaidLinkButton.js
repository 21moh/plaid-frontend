import { useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { usePlaid } from './PlaidContext';

export default function PlaidLinkButton() {
  const { linkToken, onLinkSuccess } = usePlaid();
  const isOauth = window.location.href.includes('?oauth_state_id=');

  const config = {
    token: linkToken,
    onSuccess: onLinkSuccess,
    ...(isOauth && { receivedRedirectUri: window.location.href }),
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready && linkToken) open();
  }, [isOauth, ready, linkToken, open]);

  return (
    <button
      type="button"
      className="link-button"
      onClick={() => open()}
      disabled={!ready || !linkToken}
    >
      {!linkToken ? 'Loading...' : ready ? 'Connect your bank' : 'Loading...'}
    </button>
  );
}
