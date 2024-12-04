import {
	pgTable,
	text,
	integer,
	jsonb,
	boolean,
	timestamp
} from 'drizzle-orm/pg-core';

// Types for custom JSON fields
interface NutritionalInfo {
	calories: number;
	protein: string;
	carbs: string;
	fat: string;
	// Add additional nutritional properties as needed
}

// Schema configuration
const SCHEMA_CONFIG = {
	TABLE_NAME: 'your_table_name'
	// Add other configuration as needed
};

// Base table schema
export const contentTable = pgTable(SCHEMA_CONFIG.TABLE_NAME, {
	// Primary key
	url: text('url').primaryKey(),

	// Core content fields
	title: text('title').notNull(),
	contentArrayField1: text('content_array_1').array().notNull(),
	contentArrayField2: text('content_array_2').array().notNull(),

	// JSON data
	jsonData: jsonb('json_data').notNull().$type<{
		field1: number;
		field2: string;
		field3: string;
		field4: string;
		// Add more fields as needed
	}>(),

	// Metadata fields
	category: text('category'),
	numericMetadata: integer('numeric_metadata'),
	booleanFlag: boolean('boolean_flag').notNull().default(false),
	tags: text('tags'),

	// Time-related fields
	duration: integer('duration'), // in minutes
	createdAt: timestamp('created_at').defaultNow(),

	// Relationship fields
	userId: text('user_id').notNull(),

	// Media fields
	mediaUrl: text('media_url'),

	// Additional classification
	contentType: text('content_type')
});

// Export types for use in your application
export type DrizzleContent = typeof contentTable.$inferSelect;
export type NewDrizzleContent = typeof contentTable.$inferInsert;

// Example of how to extend the schema for specific use cases:
/*
export const recipeTable = pgTable('recipes', {
  ...contentTable,
  // Add recipe-specific fields
  cookingTime: integer('cooking_time'),
  difficulty: text('difficulty'),
  servings: integer('servings'),
});

export const articleTable = pgTable('articles', {
  ...contentTable,
  // Add article-specific fields
  author: text('author'),
  publishDate: timestamp('publish_date'),
  readingTime: integer('reading_time'),
});
*/
