'use client'
import { usePathname } from "next/navigation";
import Side from "./_components/Side";
import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isComplete = pathname.includes("complete-registration")
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 auto-rows-min 
      lg:auto-rows-auto gap-4 h-full justify-center items-center px-4
      mx-auto mt-13 py-10 ${isComplete ? "" : "max-w-5xl"}`} >

      {
        !isComplete && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Side />
          </motion.div>
        )

      }


      <motion.div
        key={pathname}
        initial={!isComplete ? { x: -200, opacity: 0 } : { opacity: 0 }}
        animate={!isComplete ? { x: 0, opacity: 1 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: isComplete ? 0.2 : 0 }}
        className={`mt-7 h-full  ${isComplete ? "col-span-full" : "lg:py-11"}`}
      >
        {children}
      </motion.div>


    </div>
  );
}
