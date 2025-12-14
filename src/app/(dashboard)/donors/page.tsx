import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'
import { Button, Badge } from '@/components/ui'
import Link from 'next/link'
import { Plus, Mail, Phone } from 'lucide-react'
import styles from './page.module.css'

interface SearchParams {
    search?: string
    page?: string
}

async function getDonors(searchParams: SearchParams) {
    const supabase = await createClient()
    const page = parseInt(searchParams.page || '1')
    const perPage = 20
    const offset = (page - 1) * perPage

    let query = supabase
        .from('donors')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + perPage - 1)

    if (searchParams.search) {
        const search = `%${searchParams.search}%`
        query = query.or(`full_name.ilike.${search},first_name.ilike.${search},last_name.ilike.${search},email.ilike.${search}`)
    }

    const { data, count } = await query

    return {
        donors: data || [],
        total: count || 0,
        page,
        perPage,
        totalPages: Math.ceil((count || 0) / perPage),
    }
}

export default async function DonorsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    const { donors, total, page, totalPages } = await getDonors(params)

    return (
        <>
            <Header
                title="Donors"
                subtitle={`${total.toLocaleString()} total donors`}
            />

            <div className={styles.content}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <form className={styles.searchForm}>
                        <input
                            type="search"
                            name="search"
                            placeholder="Search by name or email..."
                            defaultValue={params.search}
                            className={styles.searchInput}
                        />
                        <Button type="submit" variant="secondary" size="sm">
                            Search
                        </Button>
                    </form>

                    <Link href="/donors/new">
                        <Button variant="primary" icon={<Plus size={16} />}>
                            Add Donor
                        </Button>
                    </Link>
                </div>

                {/* Donors Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Organization</th>
                                <th>Status</th>
                                <th>Added</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {donors.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyRow}>
                                        {params.search
                                            ? `No donors found matching "${params.search}"`
                                            : 'No donors yet. Add your first donor!'}
                                    </td>
                                </tr>
                            ) : (
                                donors.map((donor) => {
                                    const name = donor.full_name ||
                                        `${donor.first_name || ''} ${donor.last_name || ''}`.trim() ||
                                        'Unnamed'
                                    const org = donor.nonprofit_org || donor.business || donor.church || donor.school

                                    return (
                                        <tr key={donor.id}>
                                            <td>
                                                <Link href={`/donors/${donor.id}`} className={styles.nameLink}>
                                                    {name}
                                                </Link>
                                                {donor.external_ref && (
                                                    <span className={styles.externalRef}>#{donor.external_ref}</span>
                                                )}
                                            </td>
                                            <td>
                                                {donor.email ? (
                                                    <a href={`mailto:${donor.email}`} className={styles.contactLink}>
                                                        <Mail size={14} />
                                                        {donor.email}
                                                    </a>
                                                ) : (
                                                    <span className={styles.muted}>—</span>
                                                )}
                                            </td>
                                            <td>
                                                {donor.phone ? (
                                                    <a href={`tel:${donor.phone}`} className={styles.contactLink}>
                                                        <Phone size={14} />
                                                        {donor.phone}
                                                    </a>
                                                ) : (
                                                    <span className={styles.muted}>—</span>
                                                )}
                                            </td>
                                            <td>
                                                {org ? (
                                                    <span className={styles.org}>{org}</span>
                                                ) : (
                                                    <span className={styles.muted}>—</span>
                                                )}
                                            </td>
                                            <td>
                                                <Badge variant={donor.is_active ? 'success' : 'neutral'}>
                                                    {donor.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className={styles.dateCell}>
                                                {new Date(donor.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td>
                                                <Link href={`/donors/${donor.id}/edit`}>
                                                    <Button variant="ghost" size="sm">Edit</Button>
                                                </Link>
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
                            Page {page} of {totalPages}
                        </span>
                        <div className={styles.pageButtons}>
                            {page > 1 && (
                                <Link href={`/donors?page=${page - 1}${params.search ? `&search=${params.search}` : ''}`}>
                                    <Button variant="secondary" size="sm">Previous</Button>
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link href={`/donors?page=${page + 1}${params.search ? `&search=${params.search}` : ''}`}>
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
