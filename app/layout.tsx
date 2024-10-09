import type { Metadata } from 'next';
import './globals.css';
import NavBar from './ui/navbar';
import { Noto_Sans } from 'next/font/google';
import Footer from './ui/footer';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Annual Football Championship',
  description: 'A Technical Assessment Project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.className}  antialiased`}>
        <section className="flex h-[calc(100dvh)] min-h-[calc(100dvh)] flex-col">
          <NavBar />
          <main className="relative mb-auto block overflow">
            <div className="">{children}</div>
          </main>
          <Footer />
        </section>
      </body>
    </html>
  );
}
