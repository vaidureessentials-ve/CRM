const axios = require('axios');

async function checkHealth() {
  try {
    const res = await axios.get('http://localhost:5000/api/leads');
    console.log('Backend API /api/leads is up. Status:', res.status);
    console.log('Sample data received:', res.data.length, 'leads');
  } catch (err) {
    if (err.response) {
      console.log('Backend API responded with error:', err.response.status, err.response.data);
    } else {
      console.error('Backend API connection failed:', err.message);
    }
  }
}

checkHealth();
