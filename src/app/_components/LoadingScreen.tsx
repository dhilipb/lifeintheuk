'use client';

import { Box, LinearProgress, Typography } from '@mui/material';

export function LoadingScreen({ downloadedCount }: { downloadedCount?: number }) {
	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			minHeight="80vh"
			gap={4}
			textAlign="center"
			px={2}
			sx={{
				border: '1px solid #333',
				bgcolor: '#080808',
				p: 4,
				my: 4,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Box>
				<Typography variant="h5" fontWeight="900" color="primary" sx={{ letterSpacing: 1.5, mb: 1 }}>
					Initializing Life in the UK
				</Typography>
				<Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 2, fontWeight: 700 }}>
					Generating Dataset 2026
				</Typography>
			</Box>

			<Box sx={{ width: '100%', maxWidth: '300px' }}>
				<LinearProgress sx={{ height: 2 }} />
				<Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary', fontFamily: 'monospace' }}>
					{downloadedCount !== undefined ? `Fetching questions... (${downloadedCount}/50)` : 'Fetching questions...'}
				</Typography>
			</Box>
		</Box>
	);
}
