
export interface Category {
    id: number
    department_id: number
    category_id: number
    category_name: string
    category_desc?: string | null
    status: boolean
    created_at: string   // ISO string (timestamp with timezone)
    updated_at?: string | null // can be null if not yet updated
    branch_id: number
  }