"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchInput from "./SearchInput";
import path from "path";

const Header: React.FC = () => {
  const pathname: string = usePathname();

  return (
    <nav className="flex items-center justify-between bg-black text-white h-20 px-6 md:px-12 box-border">
      <img
        id="home"
        src="https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/8f/80/18/8f801836-5772-212d-970e-34703cc29fad/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg"
        alt="Logo"
        className="h-12 md:h-16"
      />

      <div className="flex space-x-6 ml-8">
        <Link
          href="/home"
          className={`text-white ${
            pathname === "/home" ? "font-bold text-yellow-300" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/tv"
          className={`text-white ${
            pathname === "/tv" ? "font-bold text-yellow-300" : ""
          }`}
        >
          TV Shows
        </Link>
        <Link
          href="/movie"
          className={`text-white ${
            pathname === "/movie" ? "font-bold text-yellow-300" : ""
          }`}
        >
          Movies
        </Link>
      </div>

      <div className="ml-auto mr-8 w-72 relative">
        <SearchInput />
      </div>
    </nav>
  );
};

export default Header;
