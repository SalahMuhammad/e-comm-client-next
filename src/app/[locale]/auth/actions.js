'use server';
import { apiRequest } from "@/utils/api";
import { setServerCookie } from "@/utils/serverCookieHandelr";
import { getTranslations } from "next-intl/server";


export async function Login(prevState, formData) {
  const t = await getTranslations("auth.errors");

  if (!(formData instanceof FormData)) {
    return {
      success: false,
      errors: { general: t('invalidForm') }
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

  const res = await apiRequest('/api/users/login/', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const jwt = res.data.jwt;
    const quarterLength = Math.ceil(jwt.length / 4);

    await setServerCookie('auth_0', jwt.slice(0, quarterLength));
    await setServerCookie('auth_1', jwt.slice(quarterLength, quarterLength * 2));
    await setServerCookie('auth_2', jwt.slice(quarterLength * 2, quarterLength * 3));
    await setServerCookie('auth_3', jwt.slice(quarterLength * 3));
    await setServerCookie('username', res.data.username);

    // Store password change required flag
    if (res.data.password_change_required) {
      await setServerCookie('password_change_required', 'true');
    } else {
      await setServerCookie('password_change_required', 'false');
    }
  }

  return res
}

export async function changePassword(prevState, formData) {
  'use server';
  const t = await getTranslations("auth.changePassword.errors");

  const currentPassword = formData.get('current_password');
  const newPassword = formData.get('new_password');
  const confirmPassword = formData.get('confirm_password');

  // Client-side validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      ok: false,
      status: 400,
      data: {
        detail: t('allFields')
      }
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      ok: false,
      status: 400,
      data: {
        confirm_password: t('match')
      },
      values: {
        new_password: newPassword,
        confirm_password: confirmPassword
      }
    };
  }

  const res = await apiRequest('/api/users/change-password/', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    }),
  });

  // If successful, clear the password change required flag
  if (res.ok) {
    await setServerCookie('password_change_required', 'false');
  } else {
    // If failed, return values so they persist
    res.values = {
      new_password: newPassword,
      confirm_password: confirmPassword
    };
  }

  return res;
}