'use client';

import React from 'react';
import { Box, Container, ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { QuizDashboard } from './_components/QuizDashboard';

export default function LifeInTheUKPage() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
				<Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
					<QuizDashboard />
				</Container>
			</Box>
		</ThemeProvider>
	);
}
