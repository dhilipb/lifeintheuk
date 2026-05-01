import { createTheme } from '@mui/material/styles';

const GOLDEN_YELLOW = '#FFBF00';

export const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: GOLDEN_YELLOW,
			contrastText: '#000000',
		},
		secondary: {
			main: '#FFFFFF',
		},
		background: {
			default: '#000000',
			paper: '#121212',
		},
		text: {
			primary: '#FFFFFF',
			secondary: '#B0B0B0',
		},
		divider: '#333333',
	},
	typography: {
		fontFamily: '"IBM Plex Mono", "Inter", "Roboto", monospace',
		h4: {
			fontWeight: 800,
			color: GOLDEN_YELLOW,
			textTransform: 'uppercase',
			letterSpacing: '2px',
		},
		h6: {
			fontWeight: 700,
			letterSpacing: '0.5px',
		},
		button: {
			fontWeight: 700,
			textTransform: 'none',
			letterSpacing: '1px',
		},
	},
	shape: {
		borderRadius: 0,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					padding: '12px 24px',
					borderWidth: '2px',
					'&:hover': {
						borderWidth: '2px',
					},
				},
				containedPrimary: {
					backgroundColor: GOLDEN_YELLOW,
					color: '#000000',
					'&:hover': {
						backgroundColor: '#E6AC00',
					},
				},
				outlined: {
					borderColor: '#333333',
					color: '#FFFFFF',
					'&:hover': {
						borderColor: GOLDEN_YELLOW,
						backgroundColor: 'rgba(255, 191, 0, 0.05)',
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					backgroundImage: 'none',
					border: '1px solid #333333',
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					height: 8,
					backgroundColor: '#222222',
				},
				bar: {
					borderRadius: 0,
					backgroundColor: GOLDEN_YELLOW,
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					border: `1px solid ${GOLDEN_YELLOW}`,
					backgroundColor: 'rgba(255, 191, 0, 0.05)',
					color: GOLDEN_YELLOW,
				},
				icon: {
					color: GOLDEN_YELLOW,
				},
			},
		},
	},
});
