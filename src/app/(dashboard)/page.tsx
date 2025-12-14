import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'
import { Card, CardHeader, CardContent, Badge } from '@/components/ui'
import { Users, Gift, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import styles from './page.module.css'

interface StatCardProps {
    title: string
    value: string | number
    change?: number
    changeLabel?: string
    icon: React.ReactNode
}

function StatCard({ title, value, change, changeLabel, icon }: StatCardProps) {
    const isPositive = change && change > 0

    return (
        <Card className={styles.statCard}>
            <div className={styles.statHeader}>
                <div className={styles.statIcon}>{icon}</div>
                <span className={styles.statTitle}>{title}</span>
            </div>
            <div className={styles.statValue}>{value}</div>
            {change !== undefined && (
                <div className={`${styles.statChange} ${isPositive ? styles.positive : styles.negative}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{Math.abs(change)}%</span>
                    {changeLabel && <span className={styles.changeLabel}>{changeLabel}</span>}
                </div>
            )}
        </Card>
    )
}

async function getDashboardStats() {
    const supabase = await createClient()

    // Get donor counts
    const { count: totalDonors } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true })

    const { count: activeDonors } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

    // Get gift stats
    const { data: giftStats } = await supabase
        .from('gifts')
        .select('amount')

    const totalGifts = giftStats?.length || 0
    const totalAmount = giftStats?.reduce((sum, g) => sum + Number(g.amount), 0) || 0
    const avgGift = totalGifts > 0 ? totalAmount / totalGifts : 0

    // Get recent gifts
    const { data: recentGifts } = await supabase
        .from('gifts')
        .select(`
      id,
      amount,
      given_at,
      fund,
      donors (
        id,
        full_name,
        first_name,
        last_name
      )
    `)
        .order('given_at', { ascending: false })
        .limit(5)

    // Get top donors
    const { data: topDonorsData } = await supabase
        .from('gifts')
        .select(`
      donor_id,
      amount,
      donors (
        id,
        full_name,
        first_name,
        last_name
      )
    `)

    // Aggregate top donors
    const donorTotals: Record<string, { name: string; id: string; total: number }> = {}
    topDonorsData?.forEach((gift) => {
        if (gift.donor_id && gift.donors) {
            const donor = gift.donors as unknown as { id: string; full_name: string | null; first_name: string | null; last_name: string | null }
            const name = donor.full_name || `${donor.first_name || ''} ${donor.last_name || ''}`.trim() || 'Unknown'
            if (!donorTotals[gift.donor_id]) {
                donorTotals[gift.donor_id] = { name, id: donor.id, total: 0 }
            }
            donorTotals[gift.donor_id].total += Number(gift.amount)
        }
    })

    const topDonors = Object.values(donorTotals)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)

    return {
        totalDonors: totalDonors || 0,
        activeDonors: activeDonors || 0,
        totalGifts,
        totalAmount,
        avgGift,
        recentGifts: recentGifts || [],
        topDonors,
    }
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default async function DashboardPage() {
    try {
        const stats = await getDashboardStats()

        return (
            <>
                <Header title="Dashboard" subtitle="Welcome back! Here's an overview of your donor activity." />

                <div className={styles.content}>
                    {/* Stats Grid */}
                    <div className={styles.statsGrid}>
                        <StatCard
                            title="Total Donors"
                            value={stats.totalDonors.toLocaleString()}
                            change={12}
                            changeLabel="vs last month"
                            icon={<Users size={20} />}
                        />
                        <StatCard
                            title="Active Donors"
                            value={stats.activeDonors.toLocaleString()}
                            change={8}
                            changeLabel="vs last month"
                            icon={<TrendingUp size={20} />}
                        />
                        <StatCard
                            title="Total Donations"
                            value={formatCurrency(stats.totalAmount)}
                            change={23}
                            changeLabel="vs last year"
                            icon={<DollarSign size={20} />}
                        />
                        <StatCard
                            title="Average Gift"
                            value={formatCurrency(stats.avgGift)}
                            change={-5}
                            changeLabel="vs last month"
                            icon={<Gift size={20} />}
                        />
                    </div>

                    {/* Two Column Layout */}
                    <div className={styles.columns}>
                        {/* Recent Gifts */}
                        <Card>
                            <CardHeader
                                title="Recent Gifts"
                                action={<Link href="/gifts" className={styles.viewAll}>View all</Link>}
                            />
                            <CardContent>
                                {stats.recentGifts.length === 0 ? (
                                    <p className={styles.emptyText}>No gifts recorded yet.</p>
                                ) : (
                                    <div className={styles.list}>
                                        {stats.recentGifts.map((gift) => {
                                            const donor = gift.donors as unknown as { id: string; full_name: string | null; first_name: string | null; last_name: string | null } | null
                                            const donorName = donor?.full_name ||
                                                `${donor?.first_name || ''} ${donor?.last_name || ''}`.trim() ||
                                                'Anonymous'

                                            return (
                                                <div key={gift.id} className={styles.listItem}>
                                                    <div className={styles.listItemLeft}>
                                                        <span className={styles.listItemName}>{donorName}</span>
                                                        <span className={styles.listItemMeta}>
                                                            {formatDate(gift.given_at)}
                                                            {gift.fund && ` · ${gift.fund}`}
                                                        </span>
                                                    </div>
                                                    <span className={styles.listItemAmount}>
                                                        {formatCurrency(Number(gift.amount))}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Top Donors */}
                        <Card>
                            <CardHeader
                                title="Top Donors"
                                subtitle="All-time giving leaders"
                                action={<Link href="/donors" className={styles.viewAll}>View all</Link>}
                            />
                            <CardContent>
                                {stats.topDonors.length === 0 ? (
                                    <p className={styles.emptyText}>No donor data available.</p>
                                ) : (
                                    <div className={styles.list}>
                                        {stats.topDonors.map((donor, index) => (
                                            <div key={donor.id} className={styles.listItem}>
                                                <div className={styles.listItemLeft}>
                                                    <span className={styles.rank}>#{index + 1}</span>
                                                    <Link href={`/donors/${donor.id}`} className={styles.listItemName}>
                                                        {donor.name}
                                                    </Link>
                                                </div>
                                                <Badge variant="success">{formatCurrency(donor.total)}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader title="Quick Actions" />
                        <CardContent>
                            <div className={styles.quickActions}>
                                <Link href="/donors/new" className={styles.quickAction}>
                                    <Users size={24} />
                                    <span>Add Donor</span>
                                </Link>
                                <Link href="/gifts/new" className={styles.quickAction}>
                                    <Gift size={24} />
                                    <span>Record Gift</span>
                                </Link>
                                <Link href="/import" className={styles.quickAction}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span>Import Data</span>
                                </Link>
                                <Link href="/segments/new" className={styles.quickAction}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <span>Create Segment</span>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        )
    } catch (error: any) {
        return (
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <Card>
                    <CardHeader title="Dashboard Error" />
                    <CardContent>
                        <div style={{ color: 'var(--error)', padding: '1rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
                            <h3>Failed to load dashboard</h3>
                            <p style={{ fontFamily: 'monospace', marginTop: '1rem' }}>
                                {error?.message || 'Unknown error'}
                            </p>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                If this is a "supabaseUrl is required" error, please check your Vercel Environment Variables.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
