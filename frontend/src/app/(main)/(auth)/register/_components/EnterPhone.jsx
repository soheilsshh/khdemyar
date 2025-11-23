import React from 'react'
import InputTypeOne from '@/components/InputTypeOne'

function EnterPhone({ onNext, phoneNumber, onChange }) {
    return (
        <div className="flex flex-col gap-5">
            <InputTypeOne
                title="شماره تماس"
                name="firstName"
                type="text"
                dir="ltr"
                placeholder="09212981392"
                value={phoneNumber}
                onChange={onChange} 
                classNameTitle="mb-2 font-iranianSansDemiBold"
            />
            <button onClick={onNext} className="bg-green-700 text-white w-full h-11 cursor-pointer shadow-lg rounded-lg">
                ارسال کد
            </button>

        </div>
    )
}

export default EnterPhone