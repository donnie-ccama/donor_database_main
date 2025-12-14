'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout'
import { Button, Card, CardHeader, CardContent, Badge } from '@/components/ui'
import { Upload, FileSpreadsheet, Check, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import Papa from 'papaparse'
import styles from './page.module.css'
import { createClient } from '@/lib/supabase/client'

type ImportStep = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete'

interface ParsedRow {
    [key: string]: string
}

const DONOR_FIELDS = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'alternate_phone', label: 'Alternate Phone' },
    { key: 'address_line1', label: 'Address Line 1' },
    { key: 'address_line2', label: 'Address Line 2' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'postal_code', label: 'Postal Code' },
    { key: 'country', label: 'Country' },
    { key: 'nonprofit_org', label: 'Non-profit Org' },
    { key: 'business', label: 'Business' },
    { key: 'church', label: 'Church' },
    { key: 'school', label: 'School' },
    { key: 'external_ref', label: 'External ID' },
    { key: 'preferred_channel', label: 'Preferred Channel' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'x_twitter', label: 'X (Twitter)' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'venmo', label: 'Venmo' },
    { key: 'messenger', label: 'Messenger' },
    { key: 'substack', label: 'Substack' },
]

export default function ImportPage() {
    const router = useRouter()
    const [step, setStep] = useState<ImportStep>('upload')
    const [file, setFile] = useState<File | null>(null)
    const [headers, setHeaders] = useState<string[]>([])
    const [rows, setRows] = useState<ParsedRow[]>([])
    const [mapping, setMapping] = useState<Record<string, string>>({})
    const [progress, setProgress] = useState({ current: 0, total: 0, success: 0, errors: 0 })
    const [error, setError] = useState<string | null>(null)

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) handleFile(droppedFile)
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) handleFile(selectedFile)
    }

    const handleFile = (selectedFile: File) => {
        const ext = selectedFile.name.split('.').pop()?.toLowerCase()
        if (!['csv', 'txt'].includes(ext || '')) {
            setError('Please upload a CSV file')
            return
        }
        setFile(selectedFile)
        setError('')

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                if (result.errors.length > 0) {
                    setError(`Parse error: ${result.errors[0].message}`)
                    return
                }

                const parsedData = result.data as ParsedRow[]
                const parsedHeaders = result.meta.fields || []

                setHeaders(parsedHeaders)
                setRows(parsedData)

                // Auto-detect mapping
                const autoMapping: Record<string, string> = {}
                parsedHeaders.forEach((header) => {
                    const normalizedHeader = header.toLowerCase().replace(/[^a-z]/g, '')
                    DONOR_FIELDS.forEach((field) => {
                        const normalizedField = field.label.toLowerCase().replace(/[^a-z]/g, '')
                        const normalizedKey = field.key.replace(/_/g, '')
                        if (normalizedHeader === normalizedField || normalizedHeader === normalizedKey) {
                            autoMapping[header] = field.key
                        }
                    })
                })
                setMapping(autoMapping)

                setStep('mapping')
            },
            error: (err) => {
                setError(`Failed to parse file: ${err.message}`)
            },
        })
    }

    const handleMappingChange = (header: string, field: string) => {
        setMapping((prev) => {
            const newMapping = { ...prev }
            if (field === '') {
                delete newMapping[header]
            } else {
                newMapping[header] = field
            }
            return newMapping
        })
    }

    const getMappedData = () => {
        return rows.map((row) => {
            const mappedRow: Record<string, string> = {}
            Object.entries(mapping).forEach(([header, field]) => {
                if (row[header]) {
                    mappedRow[field] = row[header]
                }
            })
            return mappedRow
        })
    }

    const handleImport = async () => {
        setStep('importing')

        const mappedData = getMappedData()
        const supabase = createClient()

        let success = 0
        let errors = 0

        setProgress({ current: 0, total: mappedData.length, success: 0, errors: 0 })

        for (let i = 0; i < mappedData.length; i++) {
            const donor = mappedData[i]

            // Skip empty rows
            if (!donor.email && !donor.full_name && !donor.first_name && !donor.last_name) {
                errors++
                setProgress(p => ({ ...p, current: i + 1, errors }))
                continue
            }

            const { error } = await supabase
                .from('donors')
                .insert({
                    ...donor,
                    is_active: true,
                    country: donor.country || 'USA',
                })

            if (error) {
                errors++
            } else {
                success++
            }

            setProgress({ current: i + 1, total: mappedData.length, success, errors })
        }

        setStep('complete')
    }

    return (
        <>
            <Header title="Import Donors" subtitle="Upload a CSV file to import donors" />

            <div className={styles.content}>
                {/* Progress Steps */}
                <div className={styles.steps}>
                    <div className={`${styles.step} ${step === 'upload' ? styles.active : ''} ${['mapping', 'preview', 'importing', 'complete'].includes(step) ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>1</span>
                        <span>Upload</span>
                    </div>
                    <div className={styles.stepConnector} />
                    <div className={`${styles.step} ${step === 'mapping' ? styles.active : ''} ${['preview', 'importing', 'complete'].includes(step) ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>2</span>
                        <span>Map Fields</span>
                    </div>
                    <div className={styles.stepConnector} />
                    <div className={`${styles.step} ${step === 'preview' ? styles.active : ''} ${['importing', 'complete'].includes(step) ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>3</span>
                        <span>Preview</span>
                    </div>
                    <div className={styles.stepConnector} />
                    <div className={`${styles.step} ${step === 'importing' || step === 'complete' ? styles.active : ''} ${step === 'complete' ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>4</span>
                        <span>Import</span>
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                {/* Step 1: Upload */}
                {step === 'upload' && (
                    <Card>
                        <CardHeader title="Upload File" subtitle="Drag and drop or select a CSV file" />
                        <CardContent>
                            <div
                                className={styles.dropzone}
                                onDrop={handleFileDrop}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <Upload className={styles.dropzoneIcon} />
                                <p>Drag and drop your CSV file here</p>
                                <span>or</span>
                                <label className={styles.fileLabel}>
                                    <input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={handleFileSelect}
                                        className={styles.fileInput}
                                    />
                                    <Button variant="secondary" type="button">
                                        Select File
                                    </Button>
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Mapping */}
                {step === 'mapping' && (
                    <Card>
                        <CardHeader
                            title="Map Columns"
                            subtitle={`${headers.length} columns found · ${rows.length} rows`}
                        />
                        <CardContent>
                            <div className={styles.fileInfo}>
                                <FileSpreadsheet size={20} />
                                <span>{file?.name}</span>
                            </div>

                            <div className={styles.mappingGrid}>
                                {headers.map((header) => (
                                    <div key={header} className={styles.mappingRow}>
                                        <span className={styles.csvColumn}>{header}</span>
                                        <ArrowRight size={16} className={styles.arrow} />
                                        <select
                                            value={mapping[header] || ''}
                                            onChange={(e) => handleMappingChange(header, e.target.value)}
                                            className={styles.select}
                                        >
                                            <option value="">Skip this column</option>
                                            {DONOR_FIELDS.map((field) => (
                                                <option key={field.key} value={field.key}>
                                                    {field.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.actions}>
                                <Button variant="ghost" onClick={() => setStep('upload')} icon={<ArrowLeft size={16} />}>
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => setStep('preview')}
                                    disabled={Object.keys(mapping).length === 0}
                                    icon={<ArrowRight size={16} />}
                                >
                                    Preview Import
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Preview */}
                {step === 'preview' && (
                    <Card>
                        <CardHeader
                            title="Preview Import"
                            subtitle={`${rows.length} donors will be imported`}
                        />
                        <CardContent>
                            <div className={styles.previewTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            {Object.values(mapping).map((field) => (
                                                <th key={field}>
                                                    {DONOR_FIELDS.find(f => f.key === field)?.label || field}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getMappedData().slice(0, 5).map((row, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                {Object.values(mapping).map((field) => (
                                                    <td key={field}>{row[field] || '—'}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {rows.length > 5 && (
                                    <p className={styles.moreRows}>
                                        ... and {rows.length - 5} more rows
                                    </p>
                                )}
                            </div>

                            <div className={styles.actions}>
                                <Button variant="ghost" onClick={() => setStep('mapping')} icon={<ArrowLeft size={16} />}>
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleImport}
                                    icon={<Upload size={16} />}
                                >
                                    Start Import
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Importing */}
                {step === 'importing' && (
                    <Card>
                        <CardHeader title="Importing..." subtitle="Please wait while we import your donors" />
                        <CardContent>
                            <div className={styles.progressWrapper}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                    />
                                </div>
                                <p className={styles.progressText}>
                                    {progress.current} of {progress.total} rows processed
                                </p>
                                <div className={styles.progressStats}>
                                    <Badge variant="success">{progress.success} imported</Badge>
                                    {progress.errors > 0 && (
                                        <Badge variant="error">{progress.errors} errors</Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 5: Complete */}
                {step === 'complete' && (
                    <Card>
                        <CardHeader title="Import Complete" />
                        <CardContent>
                            <div className={styles.completeWrapper}>
                                <div className={styles.completeIcon}>
                                    <Check size={32} />
                                </div>
                                <h3>Successfully imported {progress.success} donors</h3>
                                {progress.errors > 0 && (
                                    <p className={styles.errorNote}>
                                        <AlertCircle size={16} />
                                        {progress.errors} rows had errors and were skipped
                                    </p>
                                )}
                                <div className={styles.completeActions}>
                                    <Button variant="secondary" onClick={() => router.push('/import')}>
                                        Import More
                                    </Button>
                                    <Button variant="primary" onClick={() => router.push('/donors')}>
                                        View Donors
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    )
}
