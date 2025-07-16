'use server';
import { apiRequest } from "@/utils/api";
import { setServerCookie } from "@/utils/serverCookieHandelr";
import { redirect } from 'next/navigation';

export async function Login(prevState, formData) {

  if (!(formData instanceof FormData)) {
    return { 
      success: false, 
      errors: { general: 'Invalid form submission.' } 
    };
  }

  const username = formData.get('username');
  const password = formData.get('password');
    
  if (!username || !password) {
    return { 
      success: false, 
      errors: { 
        username: !username && true,
        password: !password && true
      } 
    };
  }
  
  try {
    const res = await apiRequest('/api/users/login/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    
    const resJson = await res.json();
    if (!resJson?.jwt) {
      return { 
        success: false, 
        errors: { general: 403 } 
      };
    }
    
    await setServerCookie('auth_0', resJson.jwt.slice(0, resJson.jwt.length / 2));
    await setServerCookie('auth_1', resJson.jwt.slice(resJson.jwt.length / 2));
    await setServerCookie('username', resJson.username)
    
  } catch (error) {
    let a = {}

    if (error.status === 403) {
       a.username = username
    } else if (error.status === 404) {
      a.username = username
      a.password = password
    } else if (error.status >= 500) {
      a.username = username
      a.password = password
    } else {
      a.username = username
      a.password = password
    }

    return { 
      success: false, 
      errors: { general: error.status},
      ...a
    };
  }

  redirect('/dashboard');
}