'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';

export default function ContactPage() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold">Contact</h1>
          </div>

        <div className="bg-card rounded-lg p-8 shadow-md border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Profile Image */}
            <div className="relative w-48 h-48 overflow-hidden rounded-full border-4 border-primary/20">
              <Image 
                src="/profile-img.png" 
                alt="Kidus Dereje Zewde" 
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Name and Bio */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Kidus Dereje Zewde</h2>
              <p className="text-muted-foreground max-w-md">
                Developer of Coeus AI, passionate about creating intelligent tools that enhance learning and productivity.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <Link 
                href="https://www.linkedin.com/in/kidus-dereje-zewde-804424241/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 duration-300"
              >
                <Image 
                  src="/linkedin.svg" 
                  alt="LinkedIn" 
                  width={42} 
                  height={42} 
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
              <Link 
                href="https://github.com/kidus-der" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 duration-300"
              >
                <div className="relative w-[42px] h-[42px]">
                  <Image 
                    src="/github-light.svg" 
                    alt="GitHub" 
                    width={42} 
                    height={42} 
                    className="absolute transition-opacity duration-300 dark:opacity-100 opacity-0 hover:opacity-80"
                  />
                  <Image 
                    src="/github.svg" 
                    alt="GitHub" 
                    width={42} 
                    height={42} 
                    className="absolute transition-opacity duration-300 dark:opacity-0 opacity-100 hover:opacity-80"
                  />
                </div>
              </Link>
            </div>

            {/* Contact Information */}
            <div className="w-full max-w-md mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-medium mb-4">Get In Touch</h3>
              <p className="text-muted-foreground mb-6">
                Have questions about Coeus AI or interested in collaboration? Feel free to reach out through my social profiles above.
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="w-full md:w-auto"
              >
                Try Coeus AI
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}