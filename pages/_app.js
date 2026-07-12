import { Inter, Outfit } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} ${outfit.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}