'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardContent } from '@/components/ui'
import { createDonor, updateDonor, type DonorFormData } from '@/actions/donors'
import type { Donor } from '@/types/database'
import styles from './DonorForm.module.css'

interface DonorFormProps {
    donor?: Donor
    mode: 'create' | 'edit'
}

export function DonorForm({ donor, mode }: DonorFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState<DonorFormData>({
        external_ref: donor?.external_ref || '',
        full_name: donor?.full_name || '',
        first_name: donor?.first_name || '',
        last_name: donor?.last_name || '',
        nonprofit_org: donor?.nonprofit_org || '',
        business: donor?.business || '',
        church: donor?.church || '',
        school: donor?.school || '',
        address_line1: donor?.address_line1 || '',
        address_line2: donor?.address_line2 || '',
        city: donor?.city || '',
        state: donor?.state || '',
        postal_code: donor?.postal_code || '',
        country: donor?.country || 'USA',
        phone: donor?.phone || '',
        alternate_phone: donor?.alternate_phone || '',
        email: donor?.email || '',
        preferred_channel: donor?.preferred_channel || '',
        messenger: donor?.messenger || '',
        venmo: donor?.venmo || '',
        instagram: donor?.instagram || '',
        facebook: donor?.facebook || '',
        x_twitter: donor?.x_twitter || '',
        substack: donor?.substack || '',
        linkedin: donor?.linkedin || '',
        is_active: donor?.is_active ?? true,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = mode === 'create'
                ? await createDonor(formData)
                : await updateDonor(donor!.id, formData)

            if (result?.error) {
                setError(result.error)
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            {/* Basic Information */}
            <Card>
                <CardHeader title="Basic Information" subtitle="Name and identification" />
                <CardContent>
                    <div className={styles.grid}>
                        <Input
                            label="External ID"
                            name="external_ref"
                            value={formData.external_ref}
                            onChange={handleChange}
                            placeholder="e.g., D-001"
                            hint="Optional ID from another system"
                        />
                        <div /> {/* Spacer */}

                        <Input
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="John"
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Smith"
                        />

                        <div className={styles.fullWidth}>
                            <Input
                                label="Full Display Name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="John Smith"
                                hint="Leave blank to auto-generate from first/last name"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader title="Contact Information" subtitle="Email, phone, and address" />
                <CardContent>
                    <div className={styles.grid}>
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                        />
                        <div className={styles.selectWrapper}>
                            <label className={styles.label}>Preferred Contact</label>
                            <select
                                name="preferred_channel"
                                value={formData.preferred_channel}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Select...</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="mail">Mail</option>
                                <option value="sms">SMS</option>
                            </select>
                        </div>

                        <Input
                            label="Phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(555) 123-4567"
                        />
                        <Input
                            label="Alternate Phone"
                            name="alternate_phone"
                            type="tel"
                            value={formData.alternate_phone}
                            onChange={handleChange}
                            placeholder="(555) 987-6543"
                        />

                        <div className={styles.fullWidth}>
                            <Input
                                label="Address Line 1"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                placeholder="123 Main Street"
                            />
                        </div>
                        <div className={styles.fullWidth}>
                            <Input
                                label="Address Line 2"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleChange}
                                placeholder="Apt 4B"
                            />
                        </div>

                        <Input
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                        />
                        <Input
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="NY"
                        />
                        <Input
                            label="Postal Code"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            placeholder="10001"
                        />
                        <Input
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="USA"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Organization Affiliations */}
            <Card>
                <CardHeader title="Organization Affiliations" subtitle="Associated organizations" />
                <CardContent>
                    <div className={styles.grid}>
                        <Input
                            label="Non-profit Organization"
                            name="nonprofit_org"
                            value={formData.nonprofit_org}
                            onChange={handleChange}
                            placeholder="Charity Name"
                        />
                        <Input
                            label="Business"
                            name="business"
                            value={formData.business}
                            onChange={handleChange}
                            placeholder="Company Name"
                        />
                        <Input
                            label="Church"
                            name="church"
                            value={formData.church}
                            onChange={handleChange}
                            placeholder="Church Name"
                        />
                        <Input
                            label="School"
                            name="school"
                            value={formData.school}
                            onChange={handleChange}
                            placeholder="School Name"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
                <CardHeader title="Social Media & Messaging" subtitle="Online presence" />
                <CardContent>
                    <div className={styles.grid}>
                        <Input
                            label="Facebook"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                            placeholder="facebook.com/username"
                        />
                        <Input
                            label="Instagram"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            placeholder="@username"
                        />
                        <Input
                            label="X (Twitter)"
                            name="x_twitter"
                            value={formData.x_twitter}
                            onChange={handleChange}
                            placeholder="@username"
                        />
                        <Input
                            label="LinkedIn"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="linkedin.com/in/username"
                        />
                        <Input
                            label="Messenger"
                            name="messenger"
                            value={formData.messenger}
                            onChange={handleChange}
                            placeholder="Messenger handle"
                        />
                        <Input
                            label="Venmo"
                            name="venmo"
                            value={formData.venmo}
                            onChange={handleChange}
                            placeholder="@username"
                        />
                        <Input
                            label="Substack"
                            name="substack"
                            value={formData.substack}
                            onChange={handleChange}
                            placeholder="substack.com/@username"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Status */}
            <Card>
                <CardHeader title="Status" />
                <CardContent>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                        <span>Active donor</span>
                    </label>
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
                    {mode === 'create' ? 'Add Donor' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}
