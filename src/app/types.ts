export interface QuizQuestion {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number; // Index of options
	explanation: string;
	hint: string;
}

export interface QuizState {
	currentQuestionIndex: number;
	score: number;
	showExplanation: boolean;
	isFinished: boolean;
	answers: { questionId: string; selectedOption: number; isCorrect: boolean }[];
}
