'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout'
import { Button, Input, Card, CardHeader, CardContent, Badge } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

interface DonorListItem {
    id: string
    full_name: string | null
    first_name: string | null
    last_name: string | null
    email: string | null
}

export default function NewSegmentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [segmentType, setSegmentType] = useState<'manual' | 'rule_based'>('manual')

    // Manual selection
    const [donors, setDonors] = useState<DonorListItem[]>([])
    const [selectedDonors, setSelectedDonors] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        async function loadDonors() {
            const supabase = createClient()

            let query = supabase
                .from('donors')
                .select('id, full_name, first_name, last_name, email')
                .eq('is_active', true)
                .limit(100)

            if (searchQuery) {
                const search = `%${searchQuery}%`
                query = query.or(`full_name.ilike.${search},first_name.ilike.${search},last_name.ilike.${search},email.ilike.${search}`)
            }

            const { data } = await query
            setDonors(data || [])
        }

        loadDonors()
    }, [searchQuery])

    const toggleDonor = (donorId: string) => {
        setSelectedDonors((prev) =>
            prev.includes(donorId)
                ? prev.filter((id) => id !== donorId)
                : [...prev, donorId]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!name.trim()) {
            setError('Segment name is required')
            setLoading(false)
            return
        }

        if (segmentType === 'manual' && selectedDonors.length === 0) {
            setError('Please select at least one donor')
            setLoading(false)
            return
        }

        try {
            const supabase = createClient()

            // Create segment
            const { data: segment, error: segmentError } = await supabase
                .from('segments')
                .insert({
                    name,
                    description,
                    type: segmentType,
                })
                .select()
                .single()

            if (segmentError) throw segmentError

            // Add members for manual segments
            if (segmentType === 'manual' && selectedDonors.length > 0) {
                const members = selectedDonors.map((donorId) => ({
                    segment_id: segment.id,
                    donor_id: donorId,
                }))

                const { error: membersError } = await supabase
                    .from('segment_members')
                    .insert(members)

                if (membersError) throw membersError
            }

            router.push('/segments')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header title="Create Segment" subtitle="Organize donors into a group" />
            <div className={styles.content}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <Card>
                        <CardHeader title="Segment Details" />
                        <CardContent>
                            <div className={styles.fields}>
                                <Input
                                    label="Segment Name *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Major Donors, Event Attendees"
                                />
                                <div className={styles.field}>
                                    <label className={styles.label}>Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Optional description of this segment..."
                                        className={styles.textarea}
                                        rows={2}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Segment Type</label>
                                    <div className={styles.typeOptions}>
                                        <button
                                            type="button"
                                            className={`${styles.typeOption} ${segmentType === 'manual' ? styles.active : ''}`}
                                            onClick={() => setSegmentType('manual')}
                                        >
                                            <span className={styles.typeTitle}>Manual</span>
                                            <span className={styles.typeDesc}>Hand-pick donors to include</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.typeOption} ${segmentType === 'rule_based' ? styles.active : ''}`}
                                            onClick={() => setSegmentType('rule_based')}
                                            disabled
                                        >
                                            <span className={styles.typeTitle}>Rule-based</span>
                                            <span className={styles.typeDesc}>Coming soon</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {segmentType === 'manual' && (
                        <Card>
                            <CardHeader
                                title="Select Donors"
                                subtitle={`${selectedDonors.length} selected`}
                            />
                            <CardContent>
                                <Input
                                    placeholder="Search donors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                                <div className={styles.donorList}>
                                    {donors.map((donor) => {
                                        const name = donor.full_name ||
                                            `${donor.first_name || ''} ${donor.last_name || ''}`.trim() ||
                                            'Unnamed'
                                        const isSelected = selectedDonors.includes(donor.id)

                                        return (
                                            <button
                                                key={donor.id}
                                                type="button"
                                                className={`${styles.donorItem} ${isSelected ? styles.selected : ''}`}
                                                onClick={() => toggleDonor(donor.id)}
                                            >
                                                <div className={styles.checkbox}>
                                                    {isSelected && <span>✓</span>}
                                                </div>
                                                <div className={styles.donorInfo}>
                                                    <span className={styles.donorName}>{name}</span>
                                                    {donor.email && (
                                                        <span className={styles.donorEmail}>{donor.email}</span>
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                    {donors.length === 0 && (
                                        <p className={styles.noDonors}>No donors found</p>
                                    )}
                                </div>

                                {selectedDonors.length > 0 && (
                                    <div className={styles.selectedList}>
                                        <span className={styles.selectedLabel}>Selected:</span>
                                        {selectedDonors.slice(0, 5).map((id) => {
                                            const donor = donors.find((d) => d.id === id)
                                            return donor ? (
                                                <Badge key={id} variant="info">
                                                    {donor.full_name || `${donor.first_name || ''} ${donor.last_name || ''}`.trim()}
                                                </Badge>
                                            ) : null
                                        })}
                                        {selectedDonors.length > 5 && (
                                            <Badge variant="neutral">+{selectedDonors.length - 5} more</Badge>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <div className={styles.actions}>
                        <Button type="button" variant="ghost" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={loading}>
                            Create Segment
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}
