import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function askGemini(prompt: string, jsonResponse: boolean = false, tools?: any[], modelName: string = 'gemini-2.5-flash'): Promise<string> {
	const model = genAI.getGenerativeModel({
		model: modelName,
		tools: tools ? [{ functionDeclarations: tools }] : undefined,
		generationConfig: jsonResponse ? { responseMimeType: 'application/json' } : undefined,
	});

	let response;
	if (tools) {
		const chat = model.startChat();
		const result = await chat.sendMessage(prompt);
		response = result.response;
	} else {
		const result = await model.generateContent(prompt);
		response = result.response;
	}

	let text = response.text();

	if (jsonResponse) {
		// Clean up markdown code blocks if present
		const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
		if (match) {
			text = match[1].trim();
		} else {
			text = text.trim();
		}

		try {
			// Validate JSON
			JSON.parse(text);
		} catch (e) {
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				text = jsonMatch[0];
			}
		}
	}

	return text;
}

export async function streamGemini(prompt: string, modelName: string = 'gemini-2.5-flash') {
	const model = genAI.getGenerativeModel({
		model: modelName,
	});

	const result = await model.generateContentStream(prompt);
	return result.stream;
}
