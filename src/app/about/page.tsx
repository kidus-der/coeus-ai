'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 p-0 h-8 w-8" 
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">About Coeus</h1>
        </div>

        <div className="bg-card rounded-lg p-8 shadow-md border border-gray-100 dark:border-gray-800 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Image 
                src="/coeus-logo-dark-mode.svg" 
                alt="Coeus AI Logo" 
                width={150} 
                height={150} 
                className="rounded-lg dark:block hidden" 
              />
              <Image 
                src="/coeus-logo-light-mode.svg" 
                alt="Coeus AI Logo" 
                width={150} 
                height={150} 
                className="rounded-lg dark:hidden block" 
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">What is Coeus?</h2>
              <p className="text-muted-foreground mb-4">
                Coeus is an advanced AI-powered study assistant designed to revolutionize the way you learn and process information. Named after the Titan of intelligence and knowledge in Greek mythology, Coeus helps you extract insights, generate summaries, and interact with your study materials in a more efficient and effective way.
              </p>
              <p className="text-muted-foreground">
                Our platform combines cutting-edge natural language processing with an intuitive interface to make studying smarter, not harder.
              </p>
            </div>
          </div>

          <div className="space-y-6 mt-8">
            <h2 className="text-2xl font-semibold">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background/50 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-medium mb-2">PDF Analysis</h3>
                <p className="text-muted-foreground">
                  Upload your study materials and let Coeus analyze the content, making it searchable and interactive. No more endless scrolling through pages to find what you need.
                </p>
              </div>
              
              <div className="bg-background/50 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-medium mb-2">Smart Summaries</h3>
                <p className="text-muted-foreground">
                  Get concise summaries of complex topics, helping you grasp key concepts quickly and efficiently. Perfect for exam preparation or quick reviews.
                </p>
              </div>
              
              <div className="bg-background/50 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-medium mb-2">Interactive Q&A</h3>
                <p className="text-muted-foreground">
                  Ask questions about your documents and receive accurate, contextual answers. Coeus understands your materials and provides relevant information.
                </p>
              </div>
              
              <div className="bg-background/50 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-medium mb-2">Study Tools</h3>
                <p className="text-muted-foreground">
                  Access a variety of specialized tools designed to enhance your learning experience, from flashcard generation to concept explanations.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Why Choose Coeus?</h2>
            <p className="text-muted-foreground">
              Coeus is built with students and researchers in mind. We understand the challenges of processing large amounts of information and have created a tool that makes this process more efficient and effective. Our AI assistant helps you focus on understanding and applying knowledge rather than just collecting it.
            </p>
            <p className="text-muted-foreground">
              Whether you're a student preparing for exams, a researcher analyzing papers, or a professional staying updated in your field, Coeus adapts to your needs and helps you achieve your learning goals faster.
            </p>
          </div>

          <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
            <p className="text-muted-foreground mb-6">
              Join the growing community of Coeus users who are transforming the way they study and learn. Experience the power of AI-assisted learning and take your knowledge acquisition to the next level.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => router.push('/auth/register')} size="lg">
                Sign Up Now
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} size="lg">
                Try Coeus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}