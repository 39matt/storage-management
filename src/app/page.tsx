import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden font-['Outfit',_sans-serif] selection:bg-amber-500 selection:text-white">

        {/* Background Decoration: Abstract Geometric Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-50 rounded-full -z-10" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-emerald-50 rotate-12 -z-10" />

        <div className="relative z-10 text-center max-w-2xl px-6">

          {/* Logo Container: No shadow, hard edges, scale feedback */}
          <div className="flex justify-center mb-12">
            <div className="relative w-48 h-48 transition-transform hover:scale-110 duration-200">
              <div className="absolute inset-0 bg-gray-100 rounded-lg" />
              <Image
                  src="/logo.jpg"
                  alt="Evi-Pro Logo"
                  fill
                  className="object-contain rounded-lg p-4"
                  priority
              />
            </div>
          </div>

          {/* Typography: Bold, tight tracking, high contrast */}
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tighter text-gray-900 leading-none">
              Evi-<span className="text-blue-500">Pro</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-medium max-w-lg mx-auto leading-tight">
              Profesionalna evidencija proizvoda na dlanu.
              <span className="block text-gray-400 mt-2 font-normal">Organizujte svoj inventar brzo, lako i efikasno.</span>
            </p>
          </div>

          {/* Action: Solid color, no gradient, hard corners, dramatic scale */}
          <div className="pt-12">
            <Link href="/dashboard" className="inline-block">
              <button className="group flex items-center justify-center h-16 px-12 font-bold text-white transition-all duration-200 bg-blue-500 rounded-md hover:bg-blue-600 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2">
                <span className="text-lg">Otvori Aplikaciju</span>
                <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-200 group-hover:translate-x-2" strokeWidth={2.5} />
              </button>
            </Link>
          </div>
        </div>

        {/* Footer: Simple, flat, functional */}
        <footer className="mt-20 pb-12 text-gray-400 font-medium tracking-wide uppercase text-xs">
          &copy; {new Date().getFullYear()} Evi-Pro Software Solutions
        </footer>
      </main>
  );
}