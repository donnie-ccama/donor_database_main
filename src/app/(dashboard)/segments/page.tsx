import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout'
import { Button, Card, CardHeader, CardContent, Badge } from '@/components/ui'
import Link from 'next/link'
import { Plus, Users, FolderOpen } from 'lucide-react'
import styles from './page.module.css'

async function getSegments() {
    const supabase = await createClient()

    const { data: segments } = await supabase
        .from('segments')
        .select('*')
        .order('created_at', { ascending: false })

    // Get member counts
    const segmentsWithCounts = await Promise.all(
        (segments || []).map(async (segment) => {
            const { count } = await supabase
                .from('segment_members')
                .select('*', { count: 'exact', head: true })
                .eq('segment_id', segment.id)

            return { ...segment, memberCount: count || 0 }
        })
    )

    return segmentsWithCounts
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default async function SegmentsPage() {
    const segments = await getSegments()

    return (
        <>
            <Header
                title="Segments"
                subtitle="Organize donors into groups for targeted outreach"
            />

            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <p className={styles.count}>{segments.length} segments</p>
                    <Link href="/segments/new">
                        <Button variant="primary" icon={<Plus size={16} />}>
                            Create Segment
                        </Button>
                    </Link>
                </div>

                {segments.length === 0 ? (
                    <Card>
                        <CardContent>
                            <div className={styles.empty}>
                                <FolderOpen size={48} className={styles.emptyIcon} />
                                <h3>No segments yet</h3>
                                <p>Create your first segment to organize donors into groups.</p>
                                <Link href="/segments/new">
                                    <Button variant="primary" icon={<Plus size={16} />}>
                                        Create Segment
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className={styles.grid}>
                        {segments.map((segment) => (
                            <Link key={segment.id} href={`/segments/${segment.id}`}>
                                <Card className={styles.segmentCard}>
                                    <CardHeader
                                        title={segment.name}
                                        subtitle={segment.description || undefined}
                                    />
                                    <CardContent>
                                        <div className={styles.segmentMeta}>
                                            <div className={styles.memberCount}>
                                                <Users size={18} />
                                                <span>{segment.memberCount} members</span>
                                            </div>
                                            <div className={styles.segmentInfo}>
                                                <Badge variant={segment.type === 'rule_based' ? 'info' : 'neutral'}>
                                                    {segment.type === 'rule_based' ? 'Auto' : 'Manual'}
                                                </Badge>
                                                <span className={styles.date}>
                                                    Created {formatDate(segment.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
