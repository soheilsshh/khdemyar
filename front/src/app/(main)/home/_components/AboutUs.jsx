import Image from 'next/image'
import React from 'react'

function AboutUs() {
    return (
        <div id="about-us" className='bg-green-50 shadow-2xl min-h-60 grid grid-cols-12 mx-4 xl:mx-10 my-10 rounded-3xl ' >
            <div className=' hidden lg:block col-span-4'>
                <div className="relative  w-full h-full   ">
                    <Image
                        src="/images/bg-1.png"
                        alt="example"
                        fill
                        sizes="100%"
                        className="object-cover object-bottom-right  rounded-r-3xl"
                    />
                </div>
            </div>
            <div className='col-span-12 lg:col-span-8 p-5'>
                <div className='font-iranianSansDemiBold text-xl'>
                    درباره چایخانه حضرت رضا
                </div>
                <div className='text-justify mt-2'>
                    مسجد جامع شاهرود یکی از بناهای تاریخی و مذهبی این شهر است که قدمت آن به دوران صفویه بازمی‌گردد. این مسجد در قلب بافت قدیمی شاهرود واقع شده و با معماری سنتی ایرانی، گنبدها و کاشی‌کاری‌های زیبا، جلوه‌ای خاص به منطقه بخشیده است. مسجد جامع در گذشته نه تنها محل عبادت مردم بوده، بلکه مرکزی برای تجمعات مذهبی، آموزش علوم دینی و نشست‌های اجتماعی نیز به شمار می‌رفته است. با گذشت سال‌ها، این مسجد چندین بار مرمت و بازسازی شده تا همچنان به‌عنوان یکی از نمادهای فرهنگی و تاریخی شاهرود پابرجا بماند.
                    مسجد جامع شاهرود یکی از بناهای تاریخی و مذهبی این شهر است که قدمت آن به دوران صفویه بازمی‌گردد. این مسجد در قلب بافت قدیمی شاهرود واقع شده و با معماری سنتی ایرانی، گنبدها و کاشی‌کاری‌های زیبا، جلوه‌ای خاص به منطقه بخشیده است
                </div>
            </div>

        </div>
    )
}

export default AboutUs