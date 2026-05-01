'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface QuizHeaderProps {
	currentIndex: number;
	totalQuestions: number;
	score: number;
	selectedOption: number | null;
	userAnswers: Record<number, boolean>;
}

export function QuizHeader({ currentIndex, totalQuestions, score, selectedOption, userAnswers }: QuizHeaderProps) {
	const successRate = totalQuestions > 0 ? Math.round((score / Math.max(1, currentIndex + (selectedOption !== null ? 1 : 0))) * 100) : 0;

	return (
		<Box
			sx={{
				position: 'sticky',
				top: 0,
				zIndex: 1100,
				bgcolor: '#000000',
				pt: 3,
				pb: 2,
				borderBottom: '1px solid #333',
				mx: { xs: -2, sm: -3 },
				px: { xs: 2, sm: 3 },
			}}
		>
			<Box textAlign="center" mb={2}>
				<Typography
					variant="subtitle2"
					component="h1"
					fontWeight="800"
					sx={{
						color: 'primary.main',
						textTransform: 'uppercase',
						letterSpacing: 2,
						fontSize: '0.75rem',
					}}
				>
					Life in the UK Quiz
				</Typography>
			</Box>

			<Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1.5}>
				<Box>
					<Typography variant="caption" sx={{ letterSpacing: 1, color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem' }}>
						Progress Status
					</Typography>
					<Typography variant="h6" fontWeight="900" sx={{ lineHeight: 1.2 }}>
						Question {currentIndex + 1}{' '}
						<Typography component="span" sx={{ opacity: 0.3, fontWeight: 300 }}>
							/
						</Typography>{' '}
						{totalQuestions}
					</Typography>
				</Box>
				<Box textAlign="right">
					<Typography variant="caption" sx={{ letterSpacing: 1, color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem' }}>
						Success Rate
					</Typography>
					<Typography variant="h6" fontWeight="900" color="primary" sx={{ lineHeight: 1.2 }}>
						{successRate}%
					</Typography>
				</Box>
			</Box>

			{/* Advanced Progress Bar with Segments */}
			<Box sx={{ display: 'flex', gap: 0.5, height: 6, mb: 1 }}>
				{Array.from({ length: totalQuestions }).map((_, idx) => {
					const isAnswered = userAnswers[idx] !== undefined;
					const isCorrect = userAnswers[idx] === true;

					let bgcolor = '#222';
					let boxShadow = 'none';

					if (isAnswered) {
						bgcolor = isCorrect ? 'success.main' : 'error.main';
						boxShadow = isCorrect ? '0 0 8px rgba(46, 125, 50, 0.4)' : '0 0 8px rgba(211, 47, 47, 0.4)';
					} else if (idx === currentIndex) {
						bgcolor = 'rgba(255, 191, 0, 0.3)';
						boxShadow = '0 0 10px rgba(255, 191, 0, 0.2)';
					} else if (idx < currentIndex) {
						bgcolor = 'primary.main';
					}

					return (
						<Box
							key={idx}
							sx={{
								flex: 1,
								bgcolor: bgcolor,
								boxShadow: boxShadow,
								transition: 'all 0.3s ease',
								borderRadius: '1px',
							}}
						/>
					);
				})}
			</Box>

			<Box display="flex" justifyContent="space-between">
				<Box display="flex" gap={2}>
					<Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'success.main', opacity: 0.9, fontWeight: 700, fontSize: '0.6rem' }}>
						Pass: {score.toString().padStart(2, '0')}
					</Typography>
					<Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'error.main', opacity: 0.9, fontWeight: 700, fontSize: '0.6rem' }}>
						Fail: {(Object.keys(userAnswers).length - score).toString().padStart(2, '0')}
					</Typography>
				</Box>
				<Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 700, fontSize: '0.6rem' }}>
					Tracker: {totalQuestions > 0 ? (((currentIndex + 1) / totalQuestions) * 100).toFixed(0) : 0}%
				</Typography>
			</Box>
		</Box>
	);
}
