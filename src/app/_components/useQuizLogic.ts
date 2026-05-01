import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion } from '../types';

/* --------- Helper Functions --------- */
const parseStreamData = (text: string) => {
	let jsonText = text.trim();
	const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
	if (match) {
		jsonText = match[1].trim();
	} else {
		const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
		if (jsonMatch) {
			jsonText = jsonMatch[0];
		}
	}
	return JSON.parse(jsonText);
};

/* --------- Custom Hook --------- */
export function useQuizLogic() {
	const [questions, setQuestions] = useState<QuizQuestion[]>([]);
	const [nextQuestions, setNextQuestions] = useState<QuizQuestion[] | null>(null);
	const [isPrefetching, setIsPrefetching] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [focusedOption, setFocusedOption] = useState<number>(0);
	const [showExplanation, setShowExplanation] = useState(false);
	const [loading, setLoading] = useState(true);
	const [finished, setFinished] = useState(false);
	const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
	const [downloadedCount, setDownloadedCount] = useState(0);

	/* --------- Fetch Actions --------- */
	const fetchQuestions = useCallback(async () => {
		if (nextQuestions) {
			setQuestions(nextQuestions);
			setNextQuestions(null);
			setCurrentIndex(0);
			setScore(0);
			setFinished(false);
			setSelectedOption(null);
			setFocusedOption(0);
			setShowExplanation(false);
			setUserAnswers({});
			return;
		}

		setLoading(true);
		setDownloadedCount(0);
		try {
			const res = await fetch('/api/questions');
			if (!res.ok) throw new Error('Failed to fetch');

			const reader = res.body?.getReader();
			const decoder = new TextDecoder();
			let text = '';

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					text += decoder.decode(value, { stream: true });
					setDownloadedCount((text.match(/"question"\s*:/g) || []).length);
				}
			}

			const data = parseStreamData(text);
			setQuestions(data);
			setCurrentIndex(0);
			setScore(0);
			setFinished(false);
			setSelectedOption(null);
			setFocusedOption(0);
			setShowExplanation(false);
			setUserAnswers({});
		} catch (error) {
			console.error('Error fetching questions:', error);
		} finally {
			setLoading(false);
		}
	}, [nextQuestions]);

	const prefetchNextQuestions = useCallback(async () => {
		setIsPrefetching(true);
		try {
			const res = await fetch('/api/questions');
			if (res.ok) {
				const reader = res.body?.getReader();
				const decoder = new TextDecoder();
				let text = '';

				if (reader) {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						text += decoder.decode(value, { stream: true });
					}
				}

				const data = parseStreamData(text);
				setNextQuestions(data);
			}
		} catch (error) {
			console.error('Error prefetching questions:', error);
		} finally {
			setIsPrefetching(false);
		}
	}, []);

	useEffect(() => {
		fetchQuestions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* --------- Handlers --------- */
	const handleAnswer = useCallback((optionIndex: number) => {
		const currentQuestion = questions[currentIndex];
		if (!currentQuestion) return;

		const isCorrect = optionIndex === currentQuestion.correctAnswer;
		setSelectedOption(optionIndex);
		setShowExplanation(true);

		setUserAnswers(prev => ({
			...prev,
			[currentIndex]: isCorrect,
		}));

		if (isCorrect) {
			setScore(prev => prev + 1);
		}
	}, [questions, currentIndex]);

	const handleNext = useCallback(() => {
		if (currentIndex < questions.length - 1) {
			const nextIndex = currentIndex + 1;
			setCurrentIndex(nextIndex);
			setSelectedOption(null);
			setFocusedOption(0);
			setShowExplanation(false);

			if (nextIndex === Math.floor(questions.length / 2) && !nextQuestions && !isPrefetching) {
				prefetchNextQuestions();
			}
		} else {
			setFinished(true);
		}
	}, [currentIndex, questions.length, nextQuestions, isPrefetching, prefetchNextQuestions]);

	/* --------- Keyboard Events --------- */
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (loading || finished || questions.length === 0) return;

			const currentQuestion = questions[currentIndex];
			if (!currentQuestion) return;

			if (selectedOption === null) {
				if (event.key === 'ArrowDown') {
					event.preventDefault();
					setFocusedOption(prev => (prev + 1) % currentQuestion.options.length);
				} else if (event.key === 'ArrowUp') {
					event.preventDefault();
					setFocusedOption(prev => (prev - 1 + currentQuestion.options.length) % currentQuestion.options.length);
				} else if (event.key === 'Enter') {
					event.preventDefault();
					handleAnswer(focusedOption);
				}
			} else {
				if (event.key === 'Enter') {
					event.preventDefault();
					handleNext();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [loading, finished, questions, currentIndex, selectedOption, focusedOption, handleAnswer, handleNext]);

	return {
		questions,
		currentIndex,
		score,
		selectedOption,
		focusedOption,
		showExplanation,
		loading,
		finished,
		userAnswers,
		downloadedCount,
		setFocusedOption,
		handleAnswer,
		handleNext,
		fetchQuestions,
	};
}
