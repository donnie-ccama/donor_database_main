// Database types for Supabase
// These should be regenerated with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    auth_user_id: string
                    name: string | null
                    email: string | null
                    role: 'admin' | 'staff' | 'viewer'
                    created_at: string
                }
                Insert: {
                    id?: string
                    auth_user_id: string
                    name?: string | null
                    email?: string | null
                    role?: 'admin' | 'staff' | 'viewer'
                    created_at?: string
                }
                Update: {
                    id?: string
                    auth_user_id?: string
                    name?: string | null
                    email?: string | null
                    role?: 'admin' | 'staff' | 'viewer'
                    created_at?: string
                }
            }
            donors: {
                Row: {
                    id: string
                    external_ref: string | null
                    full_name: string | null
                    first_name: string | null
                    last_name: string | null
                    nonprofit_org: string | null
                    business: string | null
                    church: string | null
                    school: string | null
                    address_line1: string | null
                    address_line2: string | null
                    city: string | null
                    state: string | null
                    postal_code: string | null
                    country: string
                    phone: string | null
                    alternate_phone: string | null
                    email: string | null
                    messenger: string | null
                    venmo: string | null
                    instagram: string | null
                    facebook: string | null
                    x_twitter: string | null
                    substack: string | null
                    linkedin: string | null
                    preferred_channel: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    external_ref?: string | null
                    full_name?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    nonprofit_org?: string | null
                    business?: string | null
                    church?: string | null
                    school?: string | null
                    address_line1?: string | null
                    address_line2?: string | null
                    city?: string | null
                    state?: string | null
                    postal_code?: string | null
                    country?: string
                    phone?: string | null
                    alternate_phone?: string | null
                    email?: string | null
                    messenger?: string | null
                    venmo?: string | null
                    instagram?: string | null
                    facebook?: string | null
                    x_twitter?: string | null
                    substack?: string | null
                    linkedin?: string | null
                    preferred_channel?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    external_ref?: string | null
                    full_name?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    nonprofit_org?: string | null
                    business?: string | null
                    church?: string | null
                    school?: string | null
                    address_line1?: string | null
                    address_line2?: string | null
                    city?: string | null
                    state?: string | null
                    postal_code?: string | null
                    country?: string
                    phone?: string | null
                    alternate_phone?: string | null
                    email?: string | null
                    messenger?: string | null
                    venmo?: string | null
                    instagram?: string | null
                    facebook?: string | null
                    x_twitter?: string | null
                    substack?: string | null
                    linkedin?: string | null
                    preferred_channel?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            gifts: {
                Row: {
                    id: string
                    donor_id: string | null
                    amount: number
                    currency: string
                    given_at: string
                    channel: string | null
                    fund: string | null
                    campaign: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    donor_id?: string | null
                    amount: number
                    currency?: string
                    given_at: string
                    channel?: string | null
                    fund?: string | null
                    campaign?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    donor_id?: string | null
                    amount?: number
                    currency?: string
                    given_at?: string
                    channel?: string | null
                    fund?: string | null
                    campaign?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            interactions: {
                Row: {
                    id: string
                    donor_id: string | null
                    type: string | null
                    subject: string | null
                    detail: string | null
                    happened_at: string
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    donor_id?: string | null
                    type?: string | null
                    subject?: string | null
                    detail?: string | null
                    happened_at?: string
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    donor_id?: string | null
                    type?: string | null
                    subject?: string | null
                    detail?: string | null
                    happened_at?: string
                    created_by?: string | null
                    created_at?: string
                }
            }
            segments: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    type: string | null
                    rule_json: Json | null
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    type?: string | null
                    rule_json?: Json | null
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    type?: string | null
                    rule_json?: Json | null
                    created_by?: string | null
                    created_at?: string
                }
            }
            segment_members: {
                Row: {
                    segment_id: string
                    donor_id: string
                }
                Insert: {
                    segment_id: string
                    donor_id: string
                }
                Update: {
                    segment_id?: string
                    donor_id?: string
                }
            }
            imports: {
                Row: {
                    id: string
                    uploaded_by: string | null
                    filename: string | null
                    source: string | null
                    status: 'pending' | 'processing' | 'completed' | 'failed'
                    total_rows: number | null
                    processed_rows: number
                    error_message: string | null
                    created_at: string
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    uploaded_by?: string | null
                    filename?: string | null
                    source?: string | null
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    total_rows?: number | null
                    processed_rows?: number
                    error_message?: string | null
                    created_at?: string
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    uploaded_by?: string | null
                    filename?: string | null
                    source?: string | null
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    total_rows?: number | null
                    processed_rows?: number
                    error_message?: string | null
                    created_at?: string
                    completed_at?: string | null
                }
            }
            import_rows: {
                Row: {
                    id: string
                    import_id: string | null
                    raw_data: Json | null
                    normalized_data: Json | null
                    donor_id: string | null
                    status: 'pending' | 'inserted' | 'merged' | 'skipped' | 'error'
                    error_message: string | null
                }
                Insert: {
                    id?: string
                    import_id?: string | null
                    raw_data?: Json | null
                    normalized_data?: Json | null
                    donor_id?: string | null
                    status?: 'pending' | 'inserted' | 'merged' | 'skipped' | 'error'
                    error_message?: string | null
                }
                Update: {
                    id?: string
                    import_id?: string | null
                    raw_data?: Json | null
                    normalized_data?: Json | null
                    donor_id?: string | null
                    status?: 'pending' | 'inserted' | 'merged' | 'skipped' | 'error'
                    error_message?: string | null
                }
            }
            sync_targets: {
                Row: {
                    id: string
                    donor_id: string | null
                    provider: string | null
                    external_id: string | null
                    last_synced_at: string | null
                    status: string | null
                    extra: Json | null
                }
                Insert: {
                    id?: string
                    donor_id?: string | null
                    provider?: string | null
                    external_id?: string | null
                    last_synced_at?: string | null
                    status?: string | null
                    extra?: Json | null
                }
                Update: {
                    id?: string
                    donor_id?: string | null
                    provider?: string | null
                    external_id?: string | null
                    last_synced_at?: string | null
                    status?: string | null
                    extra?: Json | null
                }
            }
            sync_logs: {
                Row: {
                    id: string
                    provider: string | null
                    operation: string | null
                    payload: Json | null
                    result: Json | null
                    success: boolean | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    provider?: string | null
                    operation?: string | null
                    payload?: Json | null
                    result?: Json | null
                    success?: boolean | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    provider?: string | null
                    operation?: string | null
                    payload?: Json | null
                    result?: Json | null
                    success?: boolean | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type User = Tables<'users'>
export type Donor = Tables<'donors'>
export type Gift = Tables<'gifts'>
export type Interaction = Tables<'interactions'>
export type Segment = Tables<'segments'>
export type SegmentMember = Tables<'segment_members'>
export type Import = Tables<'imports'>
export type ImportRow = Tables<'import_rows'>
export type SyncTarget = Tables<'sync_targets'>
export type SyncLog = Tables<'sync_logs'>
