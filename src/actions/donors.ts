'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface DonorFormData {
    // Basic Info
    external_ref?: string
    full_name?: string
    first_name?: string
    last_name?: string

    // Organizations
    nonprofit_org?: string
    business?: string
    church?: string
    school?: string

    // Address
    address_line1?: string
    address_line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string

    // Contact
    phone?: string
    alternate_phone?: string
    email?: string
    preferred_channel?: string

    // Social
    messenger?: string
    venmo?: string
    instagram?: string
    facebook?: string
    x_twitter?: string
    substack?: string
    linkedin?: string

    // Status
    is_active?: boolean
}

export async function createDonor(data: DonorFormData) {
    const supabase = await createClient()

    const { error, data: donor } = await supabase
        .from('donors')
        .insert({
            ...data,
            is_active: data.is_active ?? true,
            country: data.country || 'USA',
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/donors')
    redirect(`/donors/${donor.id}`)
}

export async function updateDonor(id: string, data: DonorFormData) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('donors')
        .update(data)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/donors')
    revalidatePath(`/donors/${id}`)
    redirect(`/donors/${id}`)
}

export async function deleteDonor(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/donors')
    redirect('/donors')
}
