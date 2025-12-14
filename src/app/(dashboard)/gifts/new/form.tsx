'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardContent } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { createGift, type GiftFormData } from '@/actions/gifts'
import styles from './page.module.css'

interface DonorListItem {
    id: string
    full_name: string | null
    first_name: string | null
    last_name: string | null
    email: string | null
}

export default function GiftForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const donorIdParam = searchParams.get('donor')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [donors, setDonors] = useState<DonorListItem[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const [formData, setFormData] = useState<GiftFormData>({
        donor_id: donorIdParam || '',
        amount: 0,
        given_at: new Date().toISOString().split('T')[0],
        channel: '',
        fund: '',
        campaign: '',
        notes: '',
    })

    useEffect(() => {
        async function searchDonors() {
            if (!searchQuery && !donorIdParam) {
                setDonors([])
                return
            }

            const supabase = createClient()

            let query = supabase
                .from('donors')
                .select('id, full_name, first_name, last_name, email')
                .limit(10)

            if (donorIdParam && !searchQuery) {
                query = query.eq('id', donorIdParam)
            } else if (searchQuery) {
                const search = `%${searchQuery}%`
                query = query.or(`full_name.ilike.${search},first_name.ilike.${search},last_name.ilike.${search},email.ilike.${search}`)
            }

            const { data } = await query
            setDonors(data || [])
        }

        const timeout = setTimeout(searchDonors, 300)
        return () => clearTimeout(timeout)
    }, [searchQuery, donorIdParam])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!formData.donor_id) {
            setError('Please select a donor')
            setLoading(false)
            return
        }

        if (formData.amount <= 0) {
            setError('Amount must be greater than 0')
            setLoading(false)
            return
        }

        try {
            const result = await createGift(formData)
            if (result?.error) {
                setError(result.error)
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const selectedDonor = donors.find(d => d.id === formData.donor_id)
    const selectedDonorName = selectedDonor
        ? (selectedDonor.full_name || `${selectedDonor.first_name || ''} ${selectedDonor.last_name || ''}`.trim())
        : ''

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <Card>
                <CardHeader title="Gift Details" />
                <CardContent>
                    <div className={styles.grid}>
                        {/* Donor Selection */}
                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Donor *</label>
                            {formData.donor_id && selectedDonorName ? (
                                <div className={styles.selectedDonor}>
                                    <span>{selectedDonorName}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, donor_id: '' }))
                                            setSearchQuery('')
                                        }}
                                        className={styles.clearBtn}
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.donorSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search for a donor..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                    {donors.length > 0 && !formData.donor_id && (
                                        <div className={styles.donorDropdown}>
                                            {donors.map((donor) => {
                                                const name = donor.full_name ||
                                                    `${donor.first_name || ''} ${donor.last_name || ''}`.trim() ||
                                                    'Unnamed'
                                                return (
                                                    <button
                                                        key={donor.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, donor_id: donor.id }))
                                                            setSearchQuery('')
                                                        }}
                                                        className={styles.donorOption}
                                                    >
                                                        <span className={styles.donorName}>{name}</span>
                                                        {donor.email && (
                                                            <span className={styles.donorEmail}>{donor.email}</span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Amount */}
                        <div>
                            <Input
                                label="Amount *"
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount || ''}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <Input
                                label="Date *"
                                name="given_at"
                                type="date"
                                value={formData.given_at}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Channel */}
                        <div className={styles.selectWrapper}>
                            <label className={styles.label}>Channel</label>
                            <select
                                name="channel"
                                value={formData.channel}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Select...</option>
                                <option value="online">Online</option>
                                <option value="check">Check</option>
                                <option value="cash">Cash</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="venmo">Venmo</option>
                                <option value="paypal">PayPal</option>
                                <option value="event">Event</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Fund */}
                        <div>
                            <Input
                                label="Fund"
                                name="fund"
                                value={formData.fund}
                                onChange={handleChange}
                                placeholder="e.g., General, Operations"
                            />
                        </div>

                        {/* Campaign */}
                        <div>
                            <Input
                                label="Campaign"
                                name="campaign"
                                value={formData.campaign}
                                onChange={handleChange}
                                placeholder="e.g., Year-End Appeal 2024"
                            />
                        </div>

                        {/* Notes */}
                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Additional notes about this gift..."
                                className={styles.textarea}
                                rows={3}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className={styles.actions}>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                >
                    Record Gift
                </Button>
            </div>
        </form>
    )
}
