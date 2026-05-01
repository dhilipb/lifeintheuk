'use client';

import React, { useEffect } from 'react';
import { Typography, Button, Paper, Fade, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ResultScreenProps {
	score: number;
	total: number;
	onRestart: () => void;
}

export function ResultScreen({ score, total, onRestart }: ResultScreenProps) {
	const percentage = (score / total) * 100;

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				onRestart();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onRestart]);

	let message = 'Good effort. Keep practicing to improve your knowledge.';
	if (percentage === 100) message = "Perfect score! You're ready for the test.";
	else if (percentage >= 75) message = 'Great job! You have a strong understanding of life in the UK.';

	return (
		<Fade in={true}>
			<Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', bgcolor: '#121212', border: '2px solid #FFBF00' }}>
				<CheckCircleIcon sx={{ color: 'primary.main', fontSize: 100, mb: 3 }} />
				<Typography variant="h4" fontWeight="800" gutterBottom>
					Mission Completed
				</Typography>

				<Box sx={{ my: 5, p: 4, border: '1px solid #333', bgcolor: '#000' }}>
					<Typography variant="overline" sx={{ letterSpacing: 2, color: 'text.secondary' }}>
						Final Performance Index
					</Typography>
					<Typography variant="h1" color="primary" fontWeight="900" sx={{ mt: 1 }}>
						{score}
						<Typography component="span" variant="h3" color="text.secondary" sx={{ fontWeight: 300, mx: 1 }}>
							/
						</Typography>
						{total}
					</Typography>
				</Box>

				<Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: '400px', mx: 'auto', lineHeight: 1.8 }}>
					{message}
				</Typography>

				<Button variant="contained" startIcon={<RefreshIcon />} onClick={onRestart} size="large" fullWidth sx={{ py: 2.5, fontSize: '1.2rem' }}>
					Initialize New Session
				</Button>
			</Paper>
		</Fade>
	);
}
