import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'
import { Button, Badge } from '@/components/ui'
import Link from 'next/link'
import { Plus, Download } from 'lucide-react'
import styles from './page.module.css'

interface SearchParams {
    page?: string
    donor?: string
    fund?: string
    from?: string
    to?: string
}

async function getGifts(searchParams: SearchParams) {
    const supabase = await createClient()
    const page = parseInt(searchParams.page || '1')
    const perPage = 25
    const offset = (page - 1) * perPage

    let query = supabase
        .from('gifts')
        .select(`
      *,
      donors (
        id,
        full_name,
        first_name,
        last_name
      )
    `, { count: 'exact' })
        .order('given_at', { ascending: false })
        .range(offset, offset + perPage - 1)

    if (searchParams.donor) {
        query = query.eq('donor_id', searchParams.donor)
    }
    if (searchParams.fund) {
        query = query.eq('fund', searchParams.fund)
    }
    if (searchParams.from) {
        query = query.gte('given_at', searchParams.from)
    }
    if (searchParams.to) {
        query = query.lte('given_at', searchParams.to)
    }

    const { data, count } = await query

    // Get stats
    const { data: allGifts } = await supabase
        .from('gifts')
        .select('amount')

    const totalAmount = allGifts?.reduce((sum, g) => sum + Number(g.amount), 0) || 0
    const totalCount = allGifts?.length || 0

    // Get unique funds
    const { data: funds } = await supabase
        .from('gifts')
        .select('fund')
        .not('fund', 'is', null)

    const uniqueFunds = [...new Set(funds?.map(f => f.fund).filter(Boolean))]

    return {
        gifts: data || [],
        total: count || 0,
        page,
        perPage,
        totalPages: Math.ceil((count || 0) / perPage),
        totalAmount,
        totalCount,
        funds: uniqueFunds,
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

export default async function GiftsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    const { gifts, total, page, totalPages, totalAmount, totalCount, funds } = await getGifts(params)

    return (
        <>
            <Header
                title="Gifts"
                subtitle={`${totalCount.toLocaleString()} gifts totaling ${formatCurrency(totalAmount)}`}
            />

            <div className={styles.content}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <form className={styles.filters}>
                        <select name="fund" defaultValue={params.fund} className={styles.select}>
                            <option value="">All Funds</option>
                            {funds.map((fund) => (
                                <option key={fund} value={fund}>{fund}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            name="from"
                            defaultValue={params.from}
                            className={styles.dateInput}
                            placeholder="From date"
                        />
                        <input
                            type="date"
                            name="to"
                            defaultValue={params.to}
                            className={styles.dateInput}
                            placeholder="To date"
                        />
                        <Button type="submit" variant="secondary" size="sm">
                            Filter
                        </Button>
                    </form>

                    <div className={styles.actions}>
                        <Button variant="ghost" size="sm" icon={<Download size={16} />}>
                            Export
                        </Button>
                        <Link href="/gifts/new">
                            <Button variant="primary" icon={<Plus size={16} />}>
                                Record Gift
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Gifts Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Donor</th>
                                <th>Amount</th>
                                <th>Fund</th>
                                <th>Campaign</th>
                                <th>Channel</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gifts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyRow}>
                                        No gifts found. Record your first gift!
                                    </td>
                                </tr>
                            ) : (
                                gifts.map((gift) => {
                                    const donor = gift.donors as { id: string; full_name: string | null; first_name: string | null; last_name: string | null } | null
                                    const donorName = donor?.full_name ||
                                        `${donor?.first_name || ''} ${donor?.last_name || ''}`.trim() ||
                                        'Anonymous'

                                    return (
                                        <tr key={gift.id}>
                                            <td className={styles.dateCell}>
                                                {formatDate(gift.given_at)}
                                            </td>
                                            <td>
                                                {donor ? (
                                                    <Link href={`/donors/${donor.id}`} className={styles.donorLink}>
                                                        {donorName}
                                                    </Link>
                                                ) : (
                                                    <span className={styles.muted}>Anonymous</span>
                                                )}
                                            </td>
                                            <td className={styles.amountCell}>
                                                {formatCurrency(Number(gift.amount))}
                                            </td>
                                            <td>
                                                {gift.fund ? (
                                                    <Badge variant="info">{gift.fund}</Badge>
                                                ) : (
                                                    <span className={styles.muted}>—</span>
                                                )}
                                            </td>
                                            <td>
                                                {gift.campaign || <span className={styles.muted}>—</span>}
                                            </td>
                                            <td>
                                                {gift.channel ? (
                                                    <Badge variant="neutral">{gift.channel}</Badge>
                                                ) : (
                                                    <span className={styles.muted}>—</span>
                                                )}
                                            </td>
                                            <td className={styles.notesCell}>
                                                {gift.notes ? (
                                                    <span title={gift.notes}>{gift.notes.substring(0, 40)}{gift.notes.length > 40 ? '...' : ''}</span>
                                                ) : (
                                                    <span className={styles.muted}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <span className={styles.pageInfo}>
                            Showing {((page - 1) * 25) + 1}–{Math.min(page * 25, total)} of {total}
                        </span>
                        <div className={styles.pageButtons}>
                            {page > 1 && (
                                <Link href={`/gifts?page=${page - 1}`}>
                                    <Button variant="secondary" size="sm">Previous</Button>
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link href={`/gifts?page=${page + 1}`}>
                                    <Button variant="secondary" size="sm">Next</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
