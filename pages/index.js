import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '../components/Logo';
import HeroImage from '../public/abstract1.jpg';

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={HeroImage} alt="Hero" fill className="absolute animate-zoom" />
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-gray-700/70 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link href="/post/new" className="btn2 px-6 py-3 rounded-lg shadow-lg text-left transition duration-300 ease-in-out focus:ring-4 focus:ring-orange-300">
          Begin
        </Link>
      </div>
    </div>
  );
}
