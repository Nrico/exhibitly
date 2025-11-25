'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(2, 'Full name is required'),
    handle: z.string().min(3, 'Handle must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Handle can only contain lowercase letters, numbers, and hyphens'),
    accountType: z.enum(['artist', 'gallery']),
})

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const origin = (await import('next/headers')).headers().then(h => h.get('origin'))

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        fullName: formData.get('fullName') as string,
        handle: formData.get('handle') as string,
        accountType: formData.get('accountType') as string,
    }

    // Validate input
    const validated = signupSchema.safeParse(rawData)
    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    // Check handle availability first
    const { data: existingHandle } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', validated.data.handle)
        .single()

    if (existingHandle) {
        return { error: 'Handle is already taken' }
    }

    const { error } = await supabase.auth.signUp({
        email: validated.data.email,
        password: validated.data.password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                full_name: validated.data.fullName,
                username: validated.data.handle, // Store handle as username
                account_type: validated.data.accountType,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: 'Check your email to confirm your account.' }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const origin = (await import('next/headers')).headers().then(h => h.get('origin'))
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/update-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function updatePassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function checkHandleAvailability(handle: string) {
    const supabase = await createClient()

    if (handle.length < 3) return false

    const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', handle)
        .single()

    return !data
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = (await import('next/headers')).headers().then(h => h.get('origin'))

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
