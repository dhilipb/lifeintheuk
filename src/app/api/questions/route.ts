import { streamGemini } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
	const prompt = `
   Act as an expert tutor for the "Life in the United Kingdom" official test. 
   Generate 50 unique, factually valid questions for the year 2026.
   
   Constraints:
   - Factual Context: Ensure accuracy for 2026 (including King Charles III as monarch and current UK laws/post-Brexit status).
   - Chapter Coverage: Ensure a balanced spread across:
     1. The values and principles of the UK
     2. What is the UK? (Geography/Nations)
     3. A long and illustrious history (Ancient history to present)
     4. A modern, thriving society (Culture, Sports, Arts)
     5. The UK government, the law and your role
   - Difficulty Mix: 20% easy, 40% medium, 40% hard questions.
   - Question Types: Mix standard multiple choice with scenario-based questions (e.g., 'You are in a situation where... what is the correct legal action?').
   - Pedagogical Quality: 
     - 'explanation': Must be 2-3 sentences providing historical/legal context.
     - 'hint': Should be an indirect clue that encourages critical thinking.
   
   Output Format:
   Strict JSON array of objects:
   {
       "id": "uuid-v4",
       "question": "string",
       "options": ["string", "string", "string", "string"],
       "correctAnswer": number (0-3),
       "explanation": "string",
       "hint": "string"
   }`;
	try {
		const stream = await streamGemini(prompt, 'gemini-3.1-pro-preview');

		const encoder = new TextEncoder();
		const readableStream = new ReadableStream({
			async start(controller) {
				for await (const chunk of stream) {
					controller.enqueue(encoder.encode(chunk.text()));
				}
				controller.close();
			},
		});

		return new Response(readableStream, {
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	} catch (error) {
		console.error('Error generating questions:', error);
		return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
	}
}
