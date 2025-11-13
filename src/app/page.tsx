'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, History, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-gray-900">English Refiner</h1>
          </div>
          <Link href="/home">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              Try Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">AI-Powered English Refinement</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight text-gray-900 sm:text-6xl">
            Refine Your English
            <br />
            <span className="text-primary">Instantly & Naturally</span>
          </h1>
          <p className="text-lg leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Transform your sentences into natural, grammatically correct American English. 
            Perfect for students learning English and professionals crafting important communications.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/home">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground text-base font-semibold">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold leading-snug text-gray-800 text-center mb-12">
            Why Choose English Refiner?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-accent-success" />}
              title="Grammar Correction"
              description="Automatically detect and fix grammatical errors in your sentences."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-primary" />}
              title="Natural Phrasing"
              description="Convert your sentences to sound natural and fluent in American English."
            />
            <FeatureCard
              icon={<History className="w-8 h-8 text-accent-info" />}
              title="Conversion History"
              description="Keep track of all your past conversions for easy reference and learning."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold leading-snug text-gray-800 text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-6">
            <StepCard number={1} title="Enter Your Sentence" description="Type or paste the sentence you want to refine" />
            <StepCard number={2} title="Click Convert" description="Our AI analyzes and refines your sentence instantly" />
            <StepCard number={3} title="Review & Learn" description="Compare the original and refined versions to improve your English" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-semibold leading-snug text-gray-800">
            Ready to Improve Your English?
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Start refining your sentences now and communicate with confidence.
          </p>
          <Link href="/home">
            <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground text-base font-semibold">
              Start Refining
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm leading-relaxed text-gray-500">
                © 2025 English Refiner. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6">
              <Link href="/home" className="text-sm leading-relaxed text-gray-500 hover:text-primary">
                App
              </Link>
              <Link href="/home/history" className="text-sm leading-relaxed text-gray-500 hover:text-primary">
                History
              </Link>
              <Link href="/home/settings" className="text-sm leading-relaxed text-gray-500 hover:text-primary">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold leading-relaxed mb-2 text-gray-900">{title}</h3>
      <p className="text-base leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-base leading-relaxed text-gray-600">{description}</p>
      </div>
    </div>
  );
}
