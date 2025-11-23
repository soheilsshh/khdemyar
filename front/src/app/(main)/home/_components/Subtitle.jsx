"use client"
import React from 'react';
import { motion } from 'framer-motion';

function Subtitle() {
    const data = {
        text: "امام علی (ع) می‌فرماید: آیا شما را از فقیه کامل، خبر ندهم؟ آن که به مردم اجازه نافرمانی خدا را ندهد، و آن‌ها را از رحمت خدا نومید نسازد، و از مکر خدایشان آسوده نکند، و از قرآن رو به چیز دیگر نکند، و خیری در عبادت بدون تفقّه نیست، و خیری در علم بدون تفکّر نیست، و خیری در قرآن خواندن بدون تدبّر نیست."
    };

    return (
        <div className=' -translate-y-8 bg-green-700 rounded-2xl px-10'>
            <div className="hidden md:block  rounded-2xl z-50 w-full overflow-hidden h-15 -bottom-7 px-20   text-white py-3">
                <motion.div
                    className=" whitespace-nowrap text-lg  "
                    initial={{ x: "0%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30  
                    }}
                >
                    <span className="px-5">{data.text}</span>
                    <span className="px-5">{data.text}</span>
                </motion.div>
            </div>
        </div>
    );
}

export default Subtitle;
