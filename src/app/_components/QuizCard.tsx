'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Paper, Alert, Collapse, Tooltip, IconButton, useTheme } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import InfoIcon from '@mui/icons-material/Info';
import { QuizQuestion } from '../types';

interface QuizCardProps {
	question: QuizQuestion;
	onAnswer: (selectedOption: number) => void;
	showExplanation: boolean;
	selectedOption: number | null;
	focusedOption: number;
	onFocusOption: (index: number) => void;
}

export function QuizCard({ question, onAnswer, showExplanation, selectedOption, focusedOption, onFocusOption }: QuizCardProps) {
	const theme = useTheme();
	const [showHint, setShowHint] = useState(false);

	const handleOptionClick = (index: number) => {
		if (selectedOption !== null) return;
		onAnswer(index);
	};

	return (
		<Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, bgcolor: '#121212', border: '1px solid #333' }}>
			<Stack spacing={4}>
				<Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
					<Typography variant="h6" color="primary" sx={{ lineHeight: 1.5, fontWeight: 700 }}>
						{question.question}
					</Typography>
					<Tooltip title="Show Hint">
						<IconButton
							onClick={() => setShowHint(!showHint)}
							sx={{
								bgcolor: showHint ? 'rgba(255, 191, 0, 0.15)' : 'rgba(255,255,255,0.05)',
								color: showHint ? 'primary.main' : '#FFFFFF',
								borderRadius: 0,
							}}
						>
							<LightbulbIcon />
						</IconButton>
					</Tooltip>
				</Box>

				<Collapse in={showHint}>
					<Alert icon={<LightbulbIcon fontSize="inherit" />} severity="info">
						{question.hint}
					</Alert>
				</Collapse>

				<Stack spacing={2}>
					{question.options.map((option, index) => {
						let color: 'inherit' | 'primary' | 'success' | 'error' = 'inherit';
						let variant: 'outlined' | 'contained' = 'outlined';
						let sx = {};

						const isFocused = index === focusedOption && selectedOption === null;

						if (selectedOption !== null) {
							if (index === question.correctAnswer) {
								color = 'success';
								variant = 'contained';
								sx = { bgcolor: '#2e7d32', color: '#fff', borderColor: '#2e7d32' };
							} else if (index === selectedOption) {
								color = 'error';
								variant = 'contained';
								sx = { bgcolor: '#d32f2f', color: '#fff', borderColor: '#d32f2f' };
							}
						} else if (isFocused) {
							sx = {
								borderColor: 'primary.main',
								bgcolor: 'rgba(255, 191, 0, 0.05)',
								boxShadow: '0 0 10px rgba(255, 191, 0, 0.1)',
							};
						}

						return (
							<Button
								key={index}
								variant={variant}
								color={color}
								onClick={() => handleOptionClick(index)}
								onMouseEnter={() => selectedOption === null && onFocusOption(index)}
								sx={{
									justifyContent: 'flex-start',
									textAlign: 'left',
									py: 2.5,
									px: 3,
									fontSize: '1rem',
									borderWidth: '2px',
									'&:hover': {
										borderWidth: '2px',
										borderColor: selectedOption === null ? 'primary.main' : undefined,
										backgroundColor: selectedOption === null ? 'rgba(255, 191, 0, 0.05)' : undefined,
									},
									...sx,
								}}
								disabled={selectedOption !== null && index !== selectedOption && index !== question.correctAnswer}
							>
								<Box component="span" sx={{ mr: 2, opacity: 0.5, fontWeight: 800 }}>
									{String.fromCharCode(65 + index)}.
								</Box>
								{option}
							</Button>
						);
					})}
				</Stack>

				<Collapse in={showExplanation}>
					<Box sx={{ p: 3, bgcolor: 'rgba(255, 191, 0, 0.05)', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
						<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
							<InfoIcon sx={{ color: 'primary.main', fontSize: 20 }} />
							<Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
								Analysis
							</Typography>
						</Stack>
						<Typography variant="body1" sx={{ color: '#FFFFFF', lineHeight: 1.7, opacity: 0.9 }}>
							{question.explanation}
						</Typography>
					</Box>
				</Collapse>
			</Stack>
		</Paper>
	);
}
