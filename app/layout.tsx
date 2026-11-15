import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/inter/wght.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Debdutta Ghosh',
  description: 'Debdutta Ghosh, a student developer from Kolkata exploring AI, software development, and creative technology.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
