import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingChat from '@/components/FloatingChat';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'AmberFlow | Premium Organic Honey',
  description: 'Discover the finest organic honey, sustainably harvested from Indian farms. Pure, raw, and full of nature\'s golden goodness.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-amber-50 text-gray-900 antialiased`}
      >
        <ToastProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <FloatingChat />
            <Footer />
          </CartProvider>
        </ToastProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-0L8ZEZP3Q7" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-0L8ZEZP3Q7');
          `}
        </Script>
      </body>
    </html>
  );
}