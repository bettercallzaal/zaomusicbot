import './globals.css';

export const metadata = {
  title: 'ZAOMusicBot - Playlists',
  description: 'Create and manage playlists for ZAOMusicBot',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
