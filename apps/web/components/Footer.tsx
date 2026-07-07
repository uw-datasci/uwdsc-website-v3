import Image from "next/image";
import Link from "next/link";
import { FooterSocialLinks } from "./footer/FooterSocialLinks";

export default function Footer() {
  return (
    <>
      <hr className="border-b border-[#454545]" />
      <footer className="mx-container my-8 flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center sm:items-start">
          <Link
            href="/"
            className="relative w-11.5 h-11.5 lg:w-13.5 lg:h-13.5 mb-4 hover:cursor-pointer block"
          >
            <Image
              src="/logos/dsc.svg"
              alt="uwdsc logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <a href="mailto:contact@uwdatascience.ca" className="font-medium text-white">
            contact@uwdatascience.ca
          </a>
        </div>
        <FooterSocialLinks />
      </footer>
    </>
  );
}
