
import React from 'react'
import SocialNetworks from '../../_components/SocialNetworks'

function QuickAccess() {
    return (
        <div className='col-span-12  h-full xl:col-span-4 flex flex-col justify-around rounded-2xl shadow-2xl p-6 xl:p-8 '>
            <SocialNetworks />
            <div className='mt-10 grid grid-cols-2 gap-5'>
                <div className='flex justify-center items-center col-span-1 '>
                    <button className='p-3 xl:p-4 rounded-xl border-3 bg-green-100 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer w-full border-green-700 '>
                        ارسال بازخورد
                    </button>
                </div>
                <div className='flex justify-center items-center col-span-1 '>
                    <button className='p-3 xl:p-4 rounded-xl border-3 bg-green-100 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer w-full border-green-700 '>
                        گالری
                    </button>
                </div>
                <div className='flex justify-center items-center col-span-2 '>
                    <button className='p-3 xl:p-4 rounded-xl border-3 bg-green-100 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer w-full border-green-700 '>
                        سامانه چایخانه حضرت رضا علیه السلام شاهرود
                    </button>
                </div>
                <div className='flex justify-center items-center col-span-2 xl:col-span-1 '>
                    <button className='p-3 xl:p-4 rounded-xl border-3 bg-green-100 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer w-full border-green-700 '>
                           آستانه قدس رضوی 
                    </button>
                </div>
                <div className='flex justify-center items-center col-span-2 xl:col-span-1 '>
                    <button className='p-3 xl:p-4 rounded-xl border-3 bg-green-100 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer w-full border-green-700 '>
                          بنیاد کرامت رضوی
                    </button>
                </div>

            </div>
        </div>
    )
}

export default QuickAccess