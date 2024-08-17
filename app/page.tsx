"use client";
import Navbar from "./_components/navbar";
import Hero from "./_components/hero";
import { AuthProvider } from "./_providers/useAuth";

export default function Home() {
  return (
    <main className="px-8">
      <Hero />
    </main>
  );
}
