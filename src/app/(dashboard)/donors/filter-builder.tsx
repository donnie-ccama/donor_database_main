'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Card, Input } from '@/components/ui' // Assuming these exist, matching existing styles
import { Plus, X, Filter, Download } from 'lucide-react'
import styles from './filter-builder.module.css'

export type FilterOperator = 'eq' | 'ilike' | 'gt' | 'lt' | 'gte' | 'lte' | 'neq'

export interface FilterRule {
    id: string
    field: string
    operator: FilterOperator
    value: string
}

const FIELD_OPTIONS = [
    { value: 'full_name', label: 'Full Name', type: 'text' },
    { value: 'email', label: 'Email', type: 'text' },
    { value: 'city', label: 'City', type: 'text' },
    { value: 'state', label: 'State', type: 'text' },
    { value: 'country', label: 'Country', type: 'text' },
    { value: 'donor_type', label: 'Type (Org/Indiv)', type: 'select', options: ['Individual', 'Organization'] },
    { value: 'is_active', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
    { value: 'created_at', label: 'Date Added', type: 'date' },
]

const OPERATOR_OPTIONS = [
    { value: 'eq', label: 'Equals' },
    { value: 'neq', label: 'Not Equals' },
    { value: 'ilike', label: 'Contains' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'gte', label: 'On or After' },
    { value: 'lte', label: 'On or Before' },
]

export default function FilterBuilder() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [isOpen, setIsOpen] = useState(false)
    const [matchType, setMatchType] = useState<'and' | 'or'>('and')
    const [rules, setRules] = useState<FilterRule[]>([])

    // Load initial state from URL
    useEffect(() => {
        const filtersParam = searchParams.get('filters')
        if (filtersParam) {
            try {
                const parsed = JSON.parse(filtersParam)
                if (parsed.rules) setRules(parsed.rules)
                if (parsed.matchType) setMatchType(parsed.matchType)
                if (parsed.rules && parsed.rules.length > 0) setIsOpen(true)
            } catch (e) {
                console.error('Failed to parse filters', e)
            }
        }
    }, [searchParams])

    const addRule = () => {
        setRules([
            ...rules,
            { id: Math.random().toString(36).substr(2, 9), field: 'full_name', operator: 'ilike', value: '' }
        ])
    }

    const removeRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
    }

    const updateRule = (id: string, updates: Partial<FilterRule>) => {
        setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r))
    }

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())
        if (rules.length > 0) {
            params.set('filters', JSON.stringify({ matchType, rules }))
        } else {
            params.delete('filters')
        }
        // Reset page when filtering
        params.set('page', '1')
        router.push(`/donors?${params.toString()}`)
    }

    const clearFilters = () => {
        setRules([])
        const params = new URLSearchParams(searchParams.toString())
        params.delete('filters')
        params.set('page', '1')
        router.push(`/donors?${params.toString()}`)
        setIsOpen(false)
    }

    const handleExport = () => {
        const params = new URLSearchParams(searchParams.toString())
        // Navigate to API route for download
        window.location.href = `/api/donors/export?${params.toString()}`
    }

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <Button
                    variant={isOpen ? 'secondary' : 'ghost'}
                    onClick={() => setIsOpen(!isOpen)}
                    icon={<Filter size={16} />}
                >
                    Filters {rules.length > 0 && `(${rules.length})`}
                </Button>

                {rules.length > 0 && (
                    <Button variant="ghost" onClick={clearFilters} className={styles.clearBtn}>
                        Clear
                    </Button>
                )}

                <div style={{ flex: 1 }} />

                <Button variant="secondary" onClick={handleExport} icon={<Download size={16} />}>
                    Export CSV
                </Button>
            </div>

            {isOpen && (
                <Card className={styles.panel}>
                    <div className={styles.header}>
                        <div className={styles.matchType}>
                            <span>Match</span>
                            <select
                                value={matchType}
                                onChange={(e) => setMatchType(e.target.value as 'and' | 'or')}
                                className={styles.select}
                            >
                                <option value="and">All (AND)</option>
                                <option value="or">Any (OR)</option>
                            </select>
                            <span>of the following rules:</span>
                        </div>
                    </div>

                    <div className={styles.rulesList}>
                        {rules.map((rule) => (
                            <div key={rule.id} className={styles.rule}>
                                <select
                                    value={rule.field}
                                    onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                                    className={styles.fieldSelect}
                                >
                                    {FIELD_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>

                                <select
                                    value={rule.operator}
                                    onChange={(e) => updateRule(rule.id, { operator: e.target.value as FilterOperator })}
                                    className={styles.operatorSelect}
                                >
                                    {OPERATOR_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    value={rule.value}
                                    onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                                    className={styles.valueInput}
                                    placeholder="Value..."
                                />

                                <button
                                    onClick={() => removeRule(rule.id)}
                                    className={styles.removeBtn}
                                    title="Remove rule"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.actions}>
                        <Button variant="ghost" onClick={addRule} icon={<Plus size={16} />}>
                            Add Rule
                        </Button>
                        <div style={{ flex: 1 }} />
                        <Button variant="primary" onClick={applyFilters}>
                            Apply Filters
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}
