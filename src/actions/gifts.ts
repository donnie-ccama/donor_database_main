'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface GiftFormData {
    donor_id: string
    amount: number
    currency?: string
    given_at: string
    channel?: string
    fund?: string
    campaign?: string
    notes?: string
}

export async function createGift(data: GiftFormData) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('gifts')
        .insert({
            ...data,
            currency: data.currency || 'USD',
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/gifts')
    revalidatePath('/donors')
    revalidatePath(`/donors/${data.donor_id}`)
    revalidatePath('/')
    redirect('/gifts')
}

export async function updateGift(id: string, data: Partial<GiftFormData>) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('gifts')
        .update(data)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/gifts')
    revalidatePath('/donors')
    revalidatePath('/')
    redirect('/gifts')
}

export async function deleteGift(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/gifts')
    revalidatePath('/donors')
    revalidatePath('/')
    redirect('/gifts')
}
