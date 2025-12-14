import { Header } from '@/components/layout'
import { Card, CardHeader, CardContent, Badge } from '@/components/ui'
import { RefreshCw } from 'lucide-react'
import styles from './page.module.css'

export default function SyncPage() {
    return (
        <>
            <Header
                title="External Sync"
                subtitle="Connect with external services to sync your donor data"
            />

            <div className={styles.content}>
                <div className={styles.grid}>
                    {/* Mailchimp */}
                    <Card>
                        <CardHeader
                            title="Mailchimp"
                            subtitle="Sync segments as email audiences"
                        />
                        <CardContent>
                            <div className={styles.providerStatus}>
                                <Badge variant="neutral">Not Connected</Badge>
                            </div>
                            <p className={styles.description}>
                                Push donor segments to Mailchimp as audiences for email campaigns.
                            </p>
                            <button className={styles.connectBtn} disabled>
                                Connect (Coming Soon)
                            </button>
                        </CardContent>
                    </Card>

                    {/* Substack */}
                    <Card>
                        <CardHeader
                            title="Substack"
                            subtitle="Sync subscribers to your newsletter"
                        />
                        <CardContent>
                            <div className={styles.providerStatus}>
                                <Badge variant="neutral">Not Connected</Badge>
                            </div>
                            <p className={styles.description}>
                                Keep your Substack subscriber list in sync with your donor database.
                            </p>
                            <button className={styles.connectBtn} disabled>
                                Connect (Coming Soon)
                            </button>
                        </CardContent>
                    </Card>
                </div>

                {/* Sync History */}
                <Card>
                    <CardHeader
                        title="Sync History"
                        subtitle="Recent sync operations"
                    />
                    <CardContent>
                        <div className={styles.emptyState}>
                            <RefreshCw size={48} className={styles.emptyIcon} />
                            <h3>No sync history</h3>
                            <p>Connect a provider to start syncing your data.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* How it Works */}
                <Card>
                    <CardHeader title="How External Sync Works" />
                    <CardContent>
                        <div className={styles.howItWorks}>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>1</div>
                                <div className={styles.stepContent}>
                                    <h4>Connect a Provider</h4>
                                    <p>Link your Mailchimp or Substack account using API keys.</p>
                                </div>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>2</div>
                                <div className={styles.stepContent}>
                                    <h4>Create a Segment</h4>
                                    <p>Build a donor segment you want to sync to the external service.</p>
                                </div>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>3</div>
                                <div className={styles.stepContent}>
                                    <h4>Push to Sync</h4>
                                    <p>Send your segment to the external service as an audience or subscriber list.</p>
                                </div>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>4</div>
                                <div className={styles.stepContent}>
                                    <h4>Stay Updated</h4>
                                    <p>Changes sync automatically using Supabase Edge Functions.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
