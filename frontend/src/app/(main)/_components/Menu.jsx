"use client"
import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu } from "react-icons/fi"
import { IoClose } from "react-icons/io5"

const menus = [
  { id: 1, name: "خانه", link: "/home", type: "route" },
  { id: 2, name: "اخبار", link: "/news", type: "route" },
  { id: 3, name: "گالری", link: "/gallery", type: "route" },
  { id: 4, name: "درباره‌ما", link: "/about-us", type: "route" },
  { id: 5, name: "تماس‌ باما", link: "#contact-us", type: "scroll", scrollTo: "contact-us", targetPage: "nothing" },
  { id: 6, name: "راهنمای سامانه", link: "/guide", type: "route" },
]

const Menu = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleMenuClick = (item) => {
    if (item.type === "route") {
      router.push(item.link)
      setIsOpen(false)
    } else if (item.type === "scroll") {
      if (pathname !== item.targetPage && item.targetPage !== "nothing") {

        localStorage.setItem("scrollTo", item.scrollTo)
        router.push(item.targetPage)
      } else {
        const el = document.getElementById(item.scrollTo)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }
      setIsOpen(false)
    }
  }


  useEffect(() => {
    const scrollTo = localStorage.getItem("scrollTo")
    if (scrollTo) {
      const el = document.getElementById(scrollTo)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        localStorage.removeItem("scrollTo")
      }
    }
  }, [pathname])

  return (
    <>

      <div className="md:hidden z-50">
        <FiMenu size={30} onClick={() => setIsOpen(true)} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-2xl z-50 p-6 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">منو</h2>
              <IoClose size={28} onClick={() => setIsOpen(false)} className="cursor-pointer" />
            </div>
            <ul className="flex flex-col gap-4">
              {menus.map((item) => {
                const isActive = pathname === item.link || pathname === item.targetPage
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`block text-right w-full ${(isActive && item.type !== "scroll") ? "font-bold text-blue-600" : ""}`}
                    >
                      {item.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

 
      <ul className="hidden md:flex justify-center items-center gap-5 xl:gap-10 relative">
        {menus.map((item) => {
          const isActive = pathname.includes(item.link) 
          return (
            <li key={item.id} className={`relative ${(isActive && item.type !== "scroll") ? "font-bold" : ""}`}>
              <button onClick={() => handleMenuClick(item)} className="py-1 px-2">
                {item.name}
                {(isActive && item.type !== "scroll") && (
                  <motion.div
                    layoutId="underline"
                    className="absolute right-0 left-0 -bottom-1 h-[2px] scale-110 bg-blue-600 rounded"
                    transition={{ type: "spring", stiffness: 300, damping: 50 }}
                  />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Menu
