import { SortOrder } from 'mongoose';

export interface PaginationSearchOptions {
	page: number;
	limit: number;
	sort?: string | { [key: string]: SortOrder } | [string, SortOrder][];
}
