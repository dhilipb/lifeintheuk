'use client';

import { Box, Fade, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { QuizQuestion } from '../types';
import { LoadingScreen } from './LoadingScreen';
import { QuizCard } from './QuizCard';
import { QuizControls } from './QuizControls';
import { QuizHeader } from './QuizHeader';
import { ResultScreen } from './ResultScreen';

export function QuizDashboard() {
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

	const fetchQuestions = async () => {
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
	};

	const prefetchNextQuestions = async () => {
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
	};

	useEffect(() => {
		fetchQuestions();
	}, []);

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
	}, [loading, finished, questions, currentIndex, selectedOption, focusedOption]);

	const handleAnswer = (optionIndex: number) => {
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
	};

	const handleNext = () => {
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
	};

	if (loading) return <LoadingScreen downloadedCount={downloadedCount} />;
	if (questions.length === 0) return null;
	if (finished) return <ResultScreen score={score} total={questions.length} onRestart={fetchQuestions} />;

	const currentQuestion = questions[currentIndex];
	if (!currentQuestion) return null;

	return (
		<Stack spacing={3}>
			<QuizHeader currentIndex={currentIndex} totalQuestions={questions.length} score={score} selectedOption={selectedOption} userAnswers={userAnswers} />

			<Fade in={true} key={currentIndex}>
				<Box sx={{ pt: 1 }}>
					<QuizCard
						question={currentQuestion}
						onAnswer={handleAnswer}
						showExplanation={showExplanation}
						selectedOption={selectedOption}
						focusedOption={focusedOption}
						onFocusOption={setFocusedOption}
					/>
				</Box>
			</Fade>

			<QuizControls selectedOption={selectedOption} onNext={handleNext} isLastQuestion={currentIndex === questions.length - 1} />
		</Stack>
	);
}
