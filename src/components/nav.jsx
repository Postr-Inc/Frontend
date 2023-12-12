import Link from "next/link";
import Image from "next/image";
export default function Nav() {
  return (
    <header className="px-4 lg:px-6 xl:p-8 lg:p-8 h-14 flex items-center">
    <Link className="flex items-center justify-center" href="#">
      <Image
        src="/icons/icon-blue.jpg"
        width={45}
        height={45}
        className="rounded-full"
        alt="Open Source Social"
      />
      <span className="sr-only">Open Source Social</span>
    </Link>
    <nav className="ml-auto flex gap-4 sm:gap-6">
      <Link
        className=" font-medium hover:underline underline-offset-4 disabled:opacity-50"
        href="#"
        disabled
      >
        Download
      </Link>
      <Link
        className=" font-medium hover:underline underline-offset-4"
        href="#"
      >
        Postr Plus  
      </Link>
      <Link
        className=" font-medium hover:underline underline-offset-4"
        href="/information/privacy.pdf" target="_blank" rel="noopener noreferrer"
      >
        Privacy
      </Link>
      <Link
        className=" font-medium hover:underline underline-offset-4"
        href="#"
      >
        Help
      </Link>
    </nav>
  </header>
  );
}
