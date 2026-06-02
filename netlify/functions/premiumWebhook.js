exports.handler = async function(event) {
  return {
    statusCode: 410,
    body: JSON.stringify({ error: 'Webhook disabled. Use manual payment confirmation or client-side Firebase update instead.' })
  };
}
