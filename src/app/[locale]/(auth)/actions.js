"use server"

import { apiRequest } from "@/utils/api";
import { setServerCookie } from "@/utils/serverCookieHandelr";
import { Content } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from 'next/navigation'


export async function Login(/*previousState,*/ formData) {
    const { username, password } = Object.fromEntries(formData.entries());
    
    try {
        const res = await apiRequest('/api/users/login/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "username": username, "password": password }),
        })
        
        await setServerCookie('auth_0', res.jwt.slice(0, res.jwt.length / 2))
        await setServerCookie('auth_1', res.jwt.slice(res.jwt.length / 2))
        
        
        // setCookie('auth_0', res.jwt.slice(0, res.jwt.length / 2), {
        //     path: '/', 
        //     secure: process.env.NODE_ENV === 'production', 
        //     sameSite: 'strict',
        //     expires: 60 * 60 * 24 * 7
        // })
        // setCookie('auth_1', res.jwt.slice(res.jwt.length / 2), {
        //     path: '/', 
        //     secure: process.env.NODE_ENV === 'production', 
        //     sameSite: 'strict',
        //     expires: 60 * 60 * 24 * 7
        // })

        // return { success: true, data: res };
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login failed');
    }

    redirect('/dashboard')
}
