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
  
  const RawRes = await apiRequest('/api/users/login/', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (RawRes.cMessage) {
    if (RawRes.status === 403) {
      return { 
        success: false, 
        errors: { general: RawRes.status },
        username
      };
    }
    return { 
      success: false, 
      errors: { general: RawRes.status },
      username,
      password
    };
  }

  const res = await RawRes.json()    

  if (!res?.jwt) {
    return { 
      success: false, 
      errors: { general: 403 },
      username
    };
  }
    
  await setServerCookie('auth_0', res.jwt.slice(0, res.jwt.length / 2));
  await setServerCookie('auth_1', res.jwt.slice(res.jwt.length / 2));
  await setServerCookie('username', res.username)
    
  
  redirect('/dashboard');
}