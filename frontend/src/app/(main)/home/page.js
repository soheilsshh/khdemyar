'use client';
import React from "react";
import Header from "./_components/Header";
import Subtitle from "./_components/Subtitle";
import ImageSlider from "./_components/ImageSlider";
import QuickAccess from "./_components/QuickAccess";
import AboutUs from "./_components/AboutUs";
import { motion } from "framer-motion";

function Page() {
  return (
    <div className="">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header />
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Subtitle />
      </motion.div>

      {/* Grid Section */}
      <div className="grid grid-cols-12 max-xl:p-4 xl:px-10 gap-x-5 mt-6">
        {/* ImageSlider */}
        <motion.div
          className="col-span-12 xl:col-span-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ImageSlider />
        </motion.div>

        {/* QuickAccess */}
        <motion.div
          className="col-span-12 xl:col-span-4 h-full"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <QuickAccess />
        </motion.div>
      </div>

      {/* AboutUs */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-16"
      >
        <AboutUs />
      </motion.div>

    </div>
  );
}

export default Page;
