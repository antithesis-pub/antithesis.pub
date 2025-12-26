import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Antithesis',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
        
        <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
        
        <p className="text-xl text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition font-medium"
          >
            Go Home
          </Link>
          
          <Link 
            href="/articles"
            className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition font-medium"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}