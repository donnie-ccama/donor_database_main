import { SupabaseClient } from '@supabase/supabase-js'

export interface FilterRule {
    field: string
    operator: string
    value: string
}

export interface DonorFilters {
    matchType: 'and' | 'or'
    rules: FilterRule[]
}

export function buildDonorQuery(supabase: SupabaseClient, filters?: string, search?: string) {
    let query = supabase
        .from('donors')
        .select('*', { count: 'exact' })

    // Apply Advanced Filters
    if (filters) {
        try {
            const { matchType, rules } = JSON.parse(filters) as DonorFilters
            if (rules && rules.length > 0) {
                if (matchType === 'or') {
                    const orConditions = rules.map((r) => {
                        // "field.operator.value"
                        return `${r.field}.${r.operator}.${r.value}`
                    }).join(',')
                    query = query.or(orConditions)
                } else {
                    // AND logic
                    rules.forEach((r) => {
                        switch (r.operator) {
                            case 'eq': query = query.eq(r.field, r.value); break;
                            case 'neq': query = query.neq(r.field, r.value); break;
                            case 'ilike': query = query.ilike(r.field, `%${r.value}%`); break;
                            case 'gt': query = query.gt(r.field, r.value); break;
                            case 'lt': query = query.lt(r.field, r.value); break;
                            case 'gte': query = query.gte(r.field, r.value); break;
                            case 'lte': query = query.lte(r.field, r.value); break;
                        }
                    })
                }
            }
        } catch (e) {
            console.error('Error parsing filters', e)
        }
    }

    // Apply specific text search if provided
    if (search) {
        const s = `%${search}%`
        query = query.or(`full_name.ilike.${s},first_name.ilike.${s},last_name.ilike.${s},email.ilike.${s}`)
    }

    return query.order('created_at', { ascending: false })
}
