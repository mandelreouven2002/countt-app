import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-[#f7f7f5]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 md:px-12">
        <Link href="/" className="text-2xl font-black tracking-tight">
          Countt
        </Link>
        <nav className="flex gap-6 text-sm font-semibold text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-black transition-colors">
            About
          </Link>
          <Link href="/terms" className="hover:text-black transition-colors">
            Terms
          </Link>
        </nav>
      </div>
    </header>
  );
}
