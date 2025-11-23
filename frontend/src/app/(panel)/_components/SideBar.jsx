"use client";
import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

function SideBar({ items }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const checkMenu = (link, name = "") => {
    return pathname.includes(link) || ((pathname.includes("manager/news")
      || pathname.includes("manager/subtitle") || pathname.includes("manager/gallery")
      || pathname.includes("manager/feedback") || pathname.includes("manager/about-us")) && name === "مدیریت سایت");
  };

  const isActiveMain = (links) => links.some(link => pathname.includes(link));

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Icon */}
      <motion.div
        className="fixed top-4 right-4 z-50 lg:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <HiMenuAlt3
          size={30}
          className="text-cyan-800 cursor-pointer"
          onClick={toggleSidebar}
        />
      </motion.div>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen z-50 fixed right-0 top-0 w-60 flex flex-col gap-5 bg-dMain text-black p-4  lg:hidden"
          >
            {/* User */}
            <div className="flex justify-between items-center gap-5 translate-x-2">
              <div className="flex items-center gap-5">
                <CgProfile size={40} />
                <div className="line-clamp-1 flex-1">
                  شهاب صفری
                </div>
              </div>
              <HiX
                size={30}
                className="text-white cursor-pointer"
                onClick={toggleSidebar}
              />
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-1">
              {items.map((item, index) => {
                const isMenuActive = isActiveMain(item.section);
                console.log("item.section", item.section)
                console.log("isMenuActive", isMenuActive)
                return (
                  <React.Fragment key={index}>
                    <div
                      onClick={() => {
                        router.push(item.link);
                        setIsOpen(false); // Close sidebar on item click
                      }}
                      className="cursor-pointer w-full py-2 flex justify-start gap-3 items-center"
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>

                    {/* Animated Submenu */}
                    <AnimatePresence initial={false}>
                      {isMenuActive && item.subMenu && (
                        <motion.div
                          key="submenu"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex flex-col text-xs border-r -translate-x-2 mb-4 overflow-hidden"
                        >
                          {item.subMenu.map((sub, subIndex) => {
                            const isActive = checkMenu(sub.link);
                            return (
                              <div
                                key={subIndex}
                                onClick={() => {
                                  router.push(sub.link);
                                  setIsOpen(false); // Close sidebar on submenu click
                                }}
                                className="relative cursor-pointer w-full py-2 flex justify-start gap-3 items-center pr-6"
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="activeSubmenuIndicator"
                                    className="absolute right-0 top-0 h-full w-1.5 bg-white z-100"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                  />
                                )}
                                <span className="z-10">{sub.name}</span>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Unchanged) */}
      <div className="h-screen fixed right-0 top-0 w-60 hidden lg:flex flex-col gap-5 bg-dMain text-black p-4">
        {/* User */}
        <div className="flex justify-start items-center gap-5 translate-x-2">
          <CgProfile size={40} />
          <div className="line-clamp-1 flex-1">
            شهاب صفری
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1">
          {items.map((item, index) => {
            const isMenuActive = isActiveMain(item.section);
            console.log("item.section", item.section)
            console.log("isMenuActive", isMenuActive)
            return (
              <React.Fragment key={index}>
                <div
                  onClick={() => router.push(item.link)}
                  className="cursor-pointer w-full py-2 flex justify-start gap-3 items-center"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>

                {/* Animated Submenu */}
                <AnimatePresence initial={false}>
                  {isMenuActive && item.subMenu && (
                    <motion.div
                      key="submenu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex flex-col text-xs border-r -translate-x-2  overflow-hidden"
                    >
                      {item.subMenu.map((sub, subIndex) => {
                        const isActive = checkMenu(sub.link);
                        return (
                          <div
                            key={subIndex}
                            onClick={() => router.push(sub.link)}
                            className="relative cursor-pointer w-full py-2 flex justify-start gap-3 items-center pr-6"
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeSubmenuIndicator"
                                className="absolute right-0 top-0 h-full w-1.5 bg-white z-100"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}
                            <span className="z-10">{sub.name}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SideBar;