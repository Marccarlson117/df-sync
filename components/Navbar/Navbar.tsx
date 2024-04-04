"use client";

import { motion, AnimatePresence } from "framer-motion";
import { initialTabs as tabs } from "./nav-items";
import React, { useEffect, useState } from "react";
import YDivider from "../YDivider";
import Link from "next/dist/client/link";
import { useCurrentLocale } from "@/hooks/locale";
import { useTranslation } from "@/i18n/client";
import Image from "next/image";
import NavbarLogo from "../../public/assets/PhArrowsCounterClockwiseBold.svg";

interface Tab {
  label: string;
  path: string;
  icon?: JSX.Element;
}

const Navbar: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTabLabel = localStorage.getItem('selectedTab');
    const savedTab = tabs.find(tab => tab.label === savedTabLabel) || tabs[0];
    setSelectedTab(savedTab);
  }, []);

  useEffect(() => {
    if (isClient && selectedTab) {
      localStorage.setItem('selectedTab', selectedTab.label);
    }
  }, [selectedTab, isClient]);

  const locale = useCurrentLocale();
  const { t } = useTranslation(locale, 'translation');

  if (!selectedTab) return null; // or a loader

  return (
    <div className="absolute top-0 w-full flex items-center bg-transparent py-12 px-6 md:px-24 z-50">
      <a className="flex items-center space-x-3 rtl:space-x-reverse">
        <Image
          src={NavbarLogo}
          className="h-8 w-8"
          alt="Digital fans Logo"
          style={{ objectFit: "cover", filter: "brightness(0) invert(1)" }}
        />
        <span className="self-center text-3xl whitespace-nowrap text-CustomWhite font-ttcommons font-semibold">
          DF Sync
        </span>
      </a>
      <nav className="w-full flex justify-end items-center gap-8">
        <ul className="flex justify-between items-center gap-8">
          {tabs.map((tab) => (
            <li
              key={`${locale}-${tab.label}`}
              className={`${
                tab === selectedTab ? "selected" : ""
              } font-ttcommons text-CustomWhite relative cursor-pointer text-lg hover:text-CustomHover`}
              onClick={() => setSelectedTab(tab)}
            >
              <Link href={tab.path} className="p-2">
                {t(tab.label)}
              </Link>

              {tab === selectedTab ? (
                <motion.div
                  className="absolute bottom--1 left-0 right-0 h-1 w-full bg-indigo-500"
                  layoutId="navbarUnderline"
                />
              ) : null}
            </li>
          ))}
        </ul>
        <YDivider />
        <Link
          href={selectedTab.path}
          className="text-CustomWhite cursor-pointer hover:text-CustomHover"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab ? selectedTab.label : "empty"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {selectedTab ? selectedTab.icon : ""}
            </motion.div>
          </AnimatePresence>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
