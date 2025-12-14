import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'
import { DonorForm } from '@/components/donors/DonorForm'
import styles from './page.module.css'

async function getDonor(id: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('donors')
        .select('*')
        .eq('id', id)
        .single()

    return data
}

export default async function EditDonorPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const donor = await getDonor(id)

    if (!donor) {
        notFound()
    }

    const name = donor.full_name ||
        `${donor.first_name || ''} ${donor.last_name || ''}`.trim() ||
        'Unnamed Donor'

    return (
        <>
            <Header title={`Edit ${name}`} subtitle="Update donor information" />
            <div className={styles.content}>
                <DonorForm donor={donor} mode="edit" />
            </div>
        </>
    )
}
