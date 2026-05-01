import { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Life in the UK Quiz 2026',
	description: 'AI-powered Life in the UK test preparation for 2026',
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'Life in the UK 2026',
	},
};

export const viewport: Viewport = {
	themeColor: '#000000',
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body style={{ margin: 0 }}>{children}</body>
		</html>
	);
}
