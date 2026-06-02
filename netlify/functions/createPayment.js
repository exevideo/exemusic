exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const body = JSON.parse(event.body || '{}');
    const amount = Number(body.amount || 0);
    const packageId = String(body.packageId || '').trim();
    const uid = String(body.uid || '').trim();
    const description = String(body.description || 'ExePremium Order').trim();

    if (!amount || !packageId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing package or amount' }) };
    }

    const apiKey = 'd0d7684bc1b9379f91da8e44b080576e2def2de9a9bce4c7d80a1b5c68867c67';
    const apiSecret = 'd055f12eb2f5c7004b2d1665845aedcef4b43b1d1f08fc4a28e51152fab6c936';
    const payload = {
      amount,
      customer_name: uid ? 'ExeMusic User ' + uid.slice(0, 6) : 'ExeMusic User',
      customer_email: body.customer_email || 'no-reply@exemusic.id',
      description: description + ' | ' + packageId + ' | uid:' + uid,
      metadata: JSON.stringify({ packageId, uid })
    };

    const response = await fetch('https://qris.pw/api/create-payment.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-API-Secret': apiSecret
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error('Invalid response from QRIS.PW: ' + text);
    }

    const invoiceId = data.invoice_id || data.invoiceId || data.id || data.payment_id || data.paymentId;
    const qrCodeUrl = data.qr_image || data.qr_code || data.qris_image || data.qr_image_url || data.qris_url || data.qrurl || data.qris;

    if (!invoiceId || !qrCodeUrl) {
      return { statusCode: 502, body: JSON.stringify({ error: 'QRIS.PW response tidak lengkap', raw: data }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ invoiceId, qrCodeUrl, raw: data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal error' })
    };
  }
}
