import React from 'react'

const menus = [
    { id: 1, name: "خانه", link: "/home" },
    { id: 2, name: "اخبار", link: "/news" },
    { id: 3, name: "گالری", link: "/gallery" },
    { id: 4, name: "درباره‌ما", link: "/about-us" },
    { id: 5, name: "تماس‌ باما", link: "/contact-us" },
    { id: 6, name: "راهنمای سامانه", link: "/guide" },
]

function QuickAccess() {
    return (
        <div className='col-span-12 lg:col-span-6 xl:col-span-4 flex flex-col md:px-10 '>
                <div className='text-xl font-iranianSansDemiBold'>
                    دسترسی سریع
                </div>
                <div className='grid *:cursor-pointer grid-cols-2 mt-10 gap-10 *:hover:font-bold'>
                    {
                        menus.map(( item , index)=> (
                            <div key={index} >
                                {
                                    item.name
                                }
                            </div>
                        ))
                    }
                    <div>
                        بنیاد کرامت رضوی
                        
                    </div>
                    <div>
                        آستانه قدس رضوی
                    </div>
                    <div className='col-span-2'>
                        سامانه چایخانه حضرت رضا (ع) شاهرود
                    </div>
                </div>
        </div>
    )
}

export default QuickAccess