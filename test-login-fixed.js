#!/usr/bin/env node

const testLogin = async () => {
  try {
    // First get CSRF token
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const { csrfToken } = await csrfResponse.json();
    
    console.log('CSRF Token:', csrfToken);
    
    // Test login with storypostmart@gmail.com and the corrected password
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        csrfToken,
        email: 'storypostmart@gmail.com',
        password: 'k0bIEKibxfvzndGY',
        callbackUrl: 'http://localhost:3000/dashboard'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    // Check if we get a redirect (302) which means successful login
    if (loginResponse.status === 302 || loginResponse.headers.get('location')) {
      console.log('✅ Login successful! Redirecting to:', loginResponse.headers.get('location'));
    } else {
      const loginText = await loginResponse.text();
      console.log('❌ Login failed');
      console.log('Response preview:', loginText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
};

testLogin();