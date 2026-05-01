'use client';

import { Box, Fade, Stack } from '@mui/material';
import { LoadingScreen } from './LoadingScreen';
import { QuizCard } from './QuizCard';
import { QuizControls } from './QuizControls';
import { QuizHeader } from './QuizHeader';
import { ResultScreen } from './ResultScreen';
import { useQuizLogic } from './useQuizLogic';

export function QuizDashboard() {
	const {
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
	} = useQuizLogic();

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
