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
      }),
      redirect: 'follow' // Follow redirects
    });
    
    console.log('Final response status:', loginResponse.status);
    console.log('Final response URL:', loginResponse.url);
    
    if (loginResponse.url.includes('/dashboard')) {
      console.log('✅ Login successful! Redirected to dashboard');
      
      // Check if we can access a protected page
      const dashboardResponse = await fetch('http://localhost:3000/dashboard', {
        redirect: 'follow'
      });
      
      console.log('Dashboard access status:', dashboardResponse.status);
      console.log('Dashboard URL:', dashboardResponse.url);
      
      if (dashboardResponse.status === 200 && !dashboardResponse.url.includes('/auth/signin')) {
        console.log('✅ Successfully accessed protected dashboard page!');
      } else {
        console.log('❌ Failed to access dashboard');
      }
    } else {
      const responseText = await loginResponse.text();
      console.log('❌ Login failed - not redirected to dashboard');
      console.log('Response preview:', responseText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
};

testLogin();