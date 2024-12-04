'use server';

import { db } from '@/lib/db/index';
import { table } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function fetchRecipes() {
	try {
		const data = await db
			.select()
			.from(tableName)
			.orderBy(desc(table.createdAt));
		return { success: true, data: data };
	} catch (error) {
		console.error('Error fetching:', error);
		return { success: false, data: [] };
	}
}
