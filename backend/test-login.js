const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'nkfathima05@gmail.com',
      password: 'ihsanfath'
    });

    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Login failed!');
    console.log('Error:', error.response?.data || error.message);
  }
}

testLogin();
