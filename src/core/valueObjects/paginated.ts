export interface Paginated<T> {
    total: number
    filteredTotal: number
    items: T[]
}