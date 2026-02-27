import clsx from 'clsx';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showFooter?: boolean;
}

export function PageShell({
  children,
  className,
  contentClassName,
  showFooter = true,
}: PageShellProps) {
  return (
    <div className={clsx('page-shell', className)}>
      <Navbar />
      <main className={clsx('flex-1', contentClassName)}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
