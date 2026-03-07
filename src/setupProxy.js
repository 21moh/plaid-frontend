const { createProxyMiddleware } = require('http-proxy-middleware');

const apiHost = process.env.REACT_APP_API_HOST || 'http://127.0.0.1:8000';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiHost,
      changeOrigin: true,
      secure: false,
    })
  );
  app.use(
    '/transactions',
    createProxyMiddleware({
      target: apiHost,
      changeOrigin: true,
      secure: false,
    })
  );
};
