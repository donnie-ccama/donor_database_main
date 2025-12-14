'use client'

import { Suspense } from 'react'
import GiftForm from './form'
import { Header } from '@/components/layout'
import styles from './page.module.css'

export default function NewGiftPage() {
    return (
        <>
            <Header title="Record Gift" subtitle="Add a new donation to the system" />
            <div className={styles.content}>
                <Suspense fallback={<div>Loading form...</div>}>
                    <GiftForm />
                </Suspense>
            </div>
        </>
    )
}
