'use server';

import { revalidatePath } from 'next/cache';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db/index';

// Initialize AI model
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY!);

// Configuration
const CONFIG = {
	AI_MODEL: 'gemini-1.5-flash', // Replace with your AI model
	URL_LENGTH: 6, // Length of UUID in URL
	REVALIDATE_PATH: '/' // Path to revalidate after submission
};

// Types
interface BaseResponse {
	// Customize this interface based on your AI model's response
	[key: string]: any;
}

interface FormState {
	success: boolean;
	error: string | null;
	data: BaseResponse | null;
}

interface FormFields {
	// Define your form fields here
	[key: string]: string | boolean | number;
}

// Utilities
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
}

function generateUniqueUrl(title: string): string {
	const uuid = `${uuidv4().substring(0, CONFIG.URL_LENGTH)}`;
	const slug = slugify(title);
	return `${slug}-${uuid}`;
}

function buildPrompt(fields: FormFields): string {
	// Customize this function to build your AI prompt
	return `
    Analyze this image and provide data based on the following criteria:
    ${Object.entries(fields)
			.map(([key, value]) => `- ${key}: ${value}`)
			.join('\n')}

    Please provide the response in JSON format with the following structure:
    {
      // Define your expected response structure here
    }
  `;
}

async function parseAndValidateResponse(
	responseText: string
): Promise<BaseResponse> {
	try {
		const parsed = JSON.parse(responseText);
		// Add any validation logic here
		return parsed;
	} catch (error) {
		throw new Error('Failed to parse AI response');
	}
}

async function saveToDatabase(
	data: BaseResponse,
	fields: FormFields,
	url: string
) {
	// Customize this function to match your database schema
	await db.insert(yourTable).values({
		url,
		...data,
		...fields,
		createdAt: new Date()
	});
}

export async function submitFormWithAI(
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	try {
		// 1. Extract and validate form data
		const fields: FormFields = {
			// Extract your form fields here
			field1: formData.get('field1') as string,
			field2: formData.get('field2') === 'on'
			// ... add more fields as needed
		};

		// 2. Handle image data
		const imageData = formData.get('image') as string;
		if (!imageData) {
			throw new Error('No image provided');
		}
		const imageBase64 = imageData.split(',')[1];

		// 3. Generate AI response
		const model = genAI.getGenerativeModel({ model: CONFIG.AI_MODEL });
		const result = await model.generateContent([
			{
				inlineData: {
					mimeType: 'image/jpeg',
					data: imageBase64
				}
			},
			{ text: buildPrompt(fields) }
		]);

		// 4. Process AI response
		const response = await result.response;
		const parsedResponse = await parseAndValidateResponse(response.text());
		const url = generateUniqueUrl(parsedResponse.title || 'untitled');

		// 5. Save to database
		await saveToDatabase(parsedResponse, fields, url);

		// 6. Revalidate path and return success
		revalidatePath(CONFIG.REVALIDATE_PATH);
		return {
			success: true,
			error: null,
			data: { ...parsedResponse, url }
		};
	} catch (error) {
		console.error('Error in form submission:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Form submission failed',
			data: null
		};
	}
}
