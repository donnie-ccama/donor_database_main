import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'
import { Card, CardHeader, CardContent, Button, Badge } from '@/components/ui'
import Link from 'next/link'
import {
    Mail, Phone, MapPin, Building2, Church, GraduationCap, Heart,
    Facebook, Instagram, Twitter, Linkedin, MessageCircle, DollarSign,
    Edit, Gift, Calendar
} from 'lucide-react'
import styles from './page.module.css'

async function getDonor(id: string) {
    const supabase = await createClient()

    const { data: donor } = await supabase
        .from('donors')
        .select('*')
        .eq('id', id)
        .single()

    if (!donor) return null

    // Get gifts
    const { data: gifts } = await supabase
        .from('gifts')
        .select('*')
        .eq('donor_id', id)
        .order('given_at', { ascending: false })

    // Get interactions
    const { data: interactions } = await supabase
        .from('interactions')
        .select('*')
        .eq('donor_id', id)
        .order('happened_at', { ascending: false })
        .limit(5)

    // Get segments
    const { data: segments } = await supabase
        .from('segment_members')
        .select('segments (*)')
        .eq('donor_id', id)

    return {
        donor,
        gifts: gifts || [],
        interactions: interactions || [],
        segments: segments?.map(s => s.segments) || [],
    }
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount)
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default async function DonorDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getDonor(id)

    if (!data) {
        notFound()
    }

    const { donor, gifts, interactions, segments } = data
    const name = donor.full_name ||
        `${donor.first_name || ''} ${donor.last_name || ''}`.trim() ||
        'Unnamed Donor'

    const totalGiving = gifts.reduce((sum, g) => sum + Number(g.amount), 0)
    const giftCount = gifts.length
    const avgGift = giftCount > 0 ? totalGiving / giftCount : 0
    const lastGift = gifts[0]

    return (
        <>
            <Header
                title={name}
                subtitle={donor.email || 'No email'}
            />

            <div className={styles.content}>
                <div className={styles.columns}>
                    {/* Main Content */}
                    <div className={styles.main}>
                        {/* Quick Stats */}
                        <div className={styles.statsRow}>
                            <div className={styles.stat}>
                                <DollarSign className={styles.statIcon} />
                                <div>
                                    <span className={styles.statValue}>{formatCurrency(totalGiving)}</span>
                                    <span className={styles.statLabel}>Total Giving</span>
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <Gift className={styles.statIcon} />
                                <div>
                                    <span className={styles.statValue}>{giftCount}</span>
                                    <span className={styles.statLabel}>Gifts</span>
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <Heart className={styles.statIcon} />
                                <div>
                                    <span className={styles.statValue}>{formatCurrency(avgGift)}</span>
                                    <span className={styles.statLabel}>Avg Gift</span>
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <Calendar className={styles.statIcon} />
                                <div>
                                    <span className={styles.statValue}>
                                        {lastGift ? formatDate(lastGift.given_at) : 'N/A'}
                                    </span>
                                    <span className={styles.statLabel}>Last Gift</span>
                                </div>
                            </div>
                        </div>

                        {/* Gift History */}
                        <Card>
                            <CardHeader
                                title="Gift History"
                                action={
                                    <Link href={`/gifts/new?donor=${donor.id}`}>
                                        <Button variant="primary" size="sm" icon={<Gift size={14} />}>
                                            Record Gift
                                        </Button>
                                    </Link>
                                }
                            />
                            <CardContent>
                                {gifts.length === 0 ? (
                                    <p className={styles.emptyText}>No gifts recorded yet.</p>
                                ) : (
                                    <div className={styles.giftList}>
                                        {gifts.slice(0, 10).map((gift) => (
                                            <div key={gift.id} className={styles.giftItem}>
                                                <div className={styles.giftInfo}>
                                                    <span className={styles.giftAmount}>
                                                        {formatCurrency(Number(gift.amount))}
                                                    </span>
                                                    <span className={styles.giftMeta}>
                                                        {formatDate(gift.given_at)}
                                                        {gift.fund && ` · ${gift.fund}`}
                                                        {gift.campaign && ` · ${gift.campaign}`}
                                                    </span>
                                                </div>
                                                {gift.channel && (
                                                    <Badge variant="neutral">{gift.channel}</Badge>
                                                )}
                                            </div>
                                        ))}
                                        {gifts.length > 10 && (
                                            <Link href={`/gifts?donor=${donor.id}`} className={styles.viewMore}>
                                                View all {gifts.length} gifts
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Interactions */}
                        <Card>
                            <CardHeader title="Recent Interactions" />
                            <CardContent>
                                {interactions.length === 0 ? (
                                    <p className={styles.emptyText}>No interactions recorded yet.</p>
                                ) : (
                                    <div className={styles.interactionList}>
                                        {interactions.map((interaction) => (
                                            <div key={interaction.id} className={styles.interactionItem}>
                                                <div className={styles.interactionHeader}>
                                                    <Badge variant="info">{interaction.type || 'Note'}</Badge>
                                                    <span className={styles.interactionDate}>
                                                        {formatDate(interaction.happened_at)}
                                                    </span>
                                                </div>
                                                {interaction.subject && (
                                                    <h4 className={styles.interactionSubject}>{interaction.subject}</h4>
                                                )}
                                                {interaction.detail && (
                                                    <p className={styles.interactionDetail}>{interaction.detail}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        {/* Actions */}
                        <Card padding="md">
                            <div className={styles.actionButtons}>
                                <Link href={`/donors/${donor.id}/edit`} className={styles.actionLink}>
                                    <Button variant="secondary" icon={<Edit size={16} />} className={styles.fullWidth}>
                                        Edit Donor
                                    </Button>
                                </Link>
                                <Link href={`/gifts/new?donor=${donor.id}`} className={styles.actionLink}>
                                    <Button variant="primary" icon={<Gift size={16} />} className={styles.fullWidth}>
                                        Record Gift
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Status */}
                        <Card padding="md">
                            <h3 className={styles.sidebarTitle}>Status</h3>
                            <Badge variant={donor.is_active ? 'success' : 'neutral'} size="md">
                                {donor.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </Card>

                        {/* Contact Info */}
                        <Card padding="md">
                            <h3 className={styles.sidebarTitle}>Contact</h3>
                            <div className={styles.contactList}>
                                {donor.email && (
                                    <a href={`mailto:${donor.email}`} className={styles.contactItem}>
                                        <Mail size={16} />
                                        <span>{donor.email}</span>
                                    </a>
                                )}
                                {donor.phone && (
                                    <a href={`tel:${donor.phone}`} className={styles.contactItem}>
                                        <Phone size={16} />
                                        <span>{donor.phone}</span>
                                    </a>
                                )}
                                {donor.alternate_phone && (
                                    <a href={`tel:${donor.alternate_phone}`} className={styles.contactItem}>
                                        <Phone size={16} />
                                        <span>{donor.alternate_phone}</span>
                                    </a>
                                )}
                                {(donor.address_line1 || donor.city) && (
                                    <div className={styles.contactItem}>
                                        <MapPin size={16} />
                                        <span>
                                            {[donor.address_line1, donor.address_line2, donor.city, donor.state, donor.postal_code]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Organizations */}
                        {(donor.nonprofit_org || donor.business || donor.church || donor.school) && (
                            <Card padding="md">
                                <h3 className={styles.sidebarTitle}>Organizations</h3>
                                <div className={styles.orgList}>
                                    {donor.nonprofit_org && (
                                        <div className={styles.orgItem}>
                                            <Heart size={16} />
                                            <span>{donor.nonprofit_org}</span>
                                        </div>
                                    )}
                                    {donor.business && (
                                        <div className={styles.orgItem}>
                                            <Building2 size={16} />
                                            <span>{donor.business}</span>
                                        </div>
                                    )}
                                    {donor.church && (
                                        <div className={styles.orgItem}>
                                            <Church size={16} />
                                            <span>{donor.church}</span>
                                        </div>
                                    )}
                                    {donor.school && (
                                        <div className={styles.orgItem}>
                                            <GraduationCap size={16} />
                                            <span>{donor.school}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Social Media */}
                        {(donor.facebook || donor.instagram || donor.x_twitter || donor.linkedin || donor.messenger) && (
                            <Card padding="md">
                                <h3 className={styles.sidebarTitle}>Social</h3>
                                <div className={styles.socialList}>
                                    {donor.facebook && (
                                        <a href={donor.facebook.startsWith('http') ? donor.facebook : `https://facebook.com/${donor.facebook}`} target="_blank" rel="noopener" className={styles.socialItem}>
                                            <Facebook size={16} />
                                        </a>
                                    )}
                                    {donor.instagram && (
                                        <a href={`https://instagram.com/${donor.instagram.replace('@', '')}`} target="_blank" rel="noopener" className={styles.socialItem}>
                                            <Instagram size={16} />
                                        </a>
                                    )}
                                    {donor.x_twitter && (
                                        <a href={`https://x.com/${donor.x_twitter.replace('@', '')}`} target="_blank" rel="noopener" className={styles.socialItem}>
                                            <Twitter size={16} />
                                        </a>
                                    )}
                                    {donor.linkedin && (
                                        <a href={donor.linkedin.startsWith('http') ? donor.linkedin : `https://linkedin.com/in/${donor.linkedin}`} target="_blank" rel="noopener" className={styles.socialItem}>
                                            <Linkedin size={16} />
                                        </a>
                                    )}
                                    {donor.messenger && (
                                        <div className={styles.socialItem}>
                                            <MessageCircle size={16} />
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Segments */}
                        {segments.length > 0 && (
                            <Card padding="md">
                                <h3 className={styles.sidebarTitle}>Segments</h3>
                                <div className={styles.segmentList}>
                                    {segments.map((segment, index) => {
                                        const seg = segment as unknown as { id: string; name: string } | null
                                        return seg ? (
                                            <Link key={seg.id || index} href={`/segments/${seg.id}`}>
                                                <Badge variant="neutral">{seg.name}</Badge>
                                            </Link>
                                        ) : null
                                    })}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
