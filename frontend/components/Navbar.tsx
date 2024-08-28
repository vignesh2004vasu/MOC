import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-primary">Logo</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    'inline-flex items-center px-1 pt-1 text-sm font-medium',
                    pathname === '/dashboard'
                      ? 'border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="outline">Sign Out</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;