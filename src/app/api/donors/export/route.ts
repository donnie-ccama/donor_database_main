import { createClient } from '@/lib/supabase/server'
import { buildDonorQuery } from '@/lib/donors-query'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const filters = searchParams.get('filters') || undefined
    const search = searchParams.get('search') || undefined

    const supabase = await createClient()

    // Build query without pagination for export
    const query = buildDonorQuery(supabase, filters, search)

    const { data: donors, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!donors || donors.length === 0) {
        return new NextResponse('No data found to export', { status: 404 })
    }

    // Generate CSV
    const headers = [
        'ID',
        'Full Name',
        'Email',
        'Phone',
        'Address',
        'City',
        'State',
        'Zip',
        'Country',
        'Organization',
        'Status',
        'Created At'
    ].join(',')

    const rows = donors.map((d: any) => {
        // Handle fields that might contain commas by wrapping in quotes
        const escape = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`

        return [
            escape(d.id),
            escape(d.full_name || `${d.first_name || ''} ${d.last_name || ''}`.trim()),
            escape(d.email),
            escape(d.phone),
            escape(`${d.address_line1 || ''} ${d.address_line2 || ''}`.trim()),
            escape(d.city),
            escape(d.state),
            escape(d.postal_code),
            escape(d.country),
            escape(d.nonprofit_org || d.business || d.church || d.school),
            escape(d.is_active ? 'Active' : 'Inactive'),
            escape(d.created_at)
        ].join(',')
    }).join('\n')

    const csvContent = `${headers}\n${rows}`

    // Return as downloadable file
    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="donors_export_${new Date().toISOString().split('T')[0]}.csv"`,
        },
    })
}
