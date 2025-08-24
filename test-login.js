#!/usr/bin/env node

const testLogin = async () => {
  try {
    // First get CSRF token
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const { csrfToken } = await csrfResponse.json();
    
    console.log('CSRF Token:', csrfToken);
    
    // Test login with storypostmart@gmail.com (the user mentioned in the issue)
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        csrfToken,
        email: 'storypostmart@gmail.com',
        password: 'k0bIEKibxfvzndGY', // This is the password from the provided info
        callbackUrl: 'http://localhost:3000/dashboard'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers));
    
    const loginText = await loginResponse.text();
    console.log('Login response text:', loginText);
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
};

testLogin();