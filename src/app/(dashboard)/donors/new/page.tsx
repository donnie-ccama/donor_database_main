import { Header } from '@/components/layout'
import { DonorForm } from '@/components/donors/DonorForm'
import styles from './page.module.css'

export default function NewDonorPage() {
    return (
        <>
            <Header title="Add Donor" subtitle="Create a new donor record" />
            <div className={styles.content}>
                <DonorForm mode="create" />
            </div>
        </>
    )
}
