'use client';

import React from 'react';
import { Button, Fade, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface QuizControlsProps {
	selectedOption: number | null;
	onNext: () => void;
	isLastQuestion: boolean;
}

export function QuizControls({ selectedOption, onNext, isLastQuestion }: QuizControlsProps) {
	const theme = useTheme();

	if (selectedOption === null) return null;

	return (
		<Fade in={true}>
			<Button
				variant="contained"
				fullWidth
				size="large"
				onClick={onNext}
				endIcon={<ArrowForwardIcon />}
				sx={{
					py: 3,
					fontSize: '1.2rem',
					boxShadow: 'none',
					border: `1px solid ${theme.palette.primary.main}`,
					'&:hover': {
						boxShadow: `0 0 20px rgba(255, 191, 0, 0.3)`,
					},
				}}
			>
				{isLastQuestion ? 'Finalize Session' : 'Proceed to Next'}
			</Button>
		</Fade>
	);
}
