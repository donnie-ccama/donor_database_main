import { Header } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import styles from './page.module.css'

export default function SettingsPage() {
    return (
        <>
            <Header title="Settings" subtitle="Manage your account and preferences" />

            <div className={styles.content}>
                {/* Account */}
                <Card>
                    <CardHeader title="Account" subtitle="Your account information" />
                    <CardContent>
                        <div className={styles.settingGroup}>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>Email</h4>
                                    <p>Your login email address</p>
                                </div>
                                <span className={styles.settingValue}>user@example.com</span>
                            </div>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>Password</h4>
                                    <p>Change your password</p>
                                </div>
                                <button className={styles.settingAction}>Update</button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Organization */}
                <Card>
                    <CardHeader title="Organization" subtitle="Your organization settings" />
                    <CardContent>
                        <div className={styles.settingGroup}>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>Organization Name</h4>
                                    <p>How your organization appears in the system</p>
                                </div>
                                <span className={styles.settingValue}>My Nonprofit</span>
                            </div>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>Default Currency</h4>
                                    <p>Currency for gift amounts</p>
                                </div>
                                <span className={styles.settingValue}>USD</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader title="Notifications" subtitle="Configure email notifications" />
                    <CardContent>
                        <div className={styles.settingGroup}>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>New Gift Alerts</h4>
                                    <p>Receive email when a new gift is recorded</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" defaultChecked />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>Weekly Summary</h4>
                                    <p>Receive a weekly summary of donations</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>Import Notifications</h4>
                                    <p>Get notified when imports complete</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" defaultChecked />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data */}
                <Card>
                    <CardHeader title="Data Management" subtitle="Export and manage your data" />
                    <CardContent>
                        <div className={styles.settingGroup}>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>Export All Data</h4>
                                    <p>Download all donors and gifts as CSV</p>
                                </div>
                                <button className={styles.settingAction}>Export</button>
                            </div>
                            <div className={styles.setting}>
                                <div className={styles.settingInfo}>
                                    <h4>Delete All Data</h4>
                                    <p className={styles.dangerText}>Permanently delete all records</p>
                                </div>
                                <button className={styles.settingActionDanger}>Delete</button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
