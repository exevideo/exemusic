exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { username, userId, message, timestamp } = JSON.parse(event.body);

    // Validate inputs
    if (!username || !userId || !message || !timestamp) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get webhook URL from environment variables
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Prepare Discord embed
    const embed = {
      title: '🎵 ExeMusic Feedback Baru!',
      color: 0x00ff88,
      fields: [
        {
          name: '👤 Username',
          value: username,
          inline: true
        },
        {
          name: '🆔 User ID',
          value: userId,
          inline: true
        },
        {
          name: '⏰ Waktu Kirim',
          value: timestamp,
          inline: false
        },
        {
          name: '💬 Pesan Feedback',
          value: message.length > 1024 ? message.substring(0, 1021) + '...' : message,
          inline: false
        }
      ],
      footer: {
        text: 'ExeMusic v3.3.2 - Feedback System',
        icon_url: 'https://i.imgur.com/your-icon.png'
      },
      timestamp: new Date().toISOString()
    };

    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
        username: 'ExeMusic Feedback Bot',
        avatar_url: 'https://i.imgur.com/your-avatar.png'
      })
    });

    if (!response.ok) {
      throw new Error(`Discord API returned status ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Feedback sent successfully' })
    };

  } catch (error) {
    console.error('Feedback function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process feedback' })
    };
  }
};
