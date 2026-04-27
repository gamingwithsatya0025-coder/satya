"use client"; 

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

function NavHeader({ links }: { links: { name: string, path: string }[] }) {
  const location = useLocation();
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto hidden lg:flex items-center gap-6 w-fit rounded-full border border-white/[0.08] bg-white/[0.05] p-2 backdrop-blur-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.6)]"
      onMouseLeave={() => {
        // Active tab reset logic
      }}
    >
      {links.map((link, idx) => (
         <Tab key={idx} setPosition={setPosition} path={link.path}>{link.name}</Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  path
}: {
  children: React.ReactNode;
  setPosition: any;
  path: string;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const location = useLocation();
  const isActive = location.pathname === path;

  const updatePosition = () => {
    if (!ref.current) return;
    setPosition({
        width: ref.current.offsetWidth,
        opacity: 1,
        left: ref.current.offsetLeft,
    });
  };

  useEffect(() => {
    if (isActive) {
        // Small delay to ensure refs are ready
        const timeout = setTimeout(updatePosition, 50);
        return () => clearTimeout(timeout);
    }
  }, [isActive, location.pathname]);

  return (
    <li
      ref={ref}
      onMouseEnter={updatePosition}
      className={`relative z-10 flex cursor-pointer px-8 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 shrink-0 whitespace-nowrap ${isActive ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
    >
      <Link to={path} className="w-full h-full flex items-center justify-center">
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="absolute z-0 h-9 rounded-full bg-white/[0.08] border border-white/10 shadow-lg"
    />
  );
};

export default NavHeader;
