import InputTypeOne from '@/components/InputTypeOne'
import React from 'react'

function NewPass() {
    return (
        <div className='flex flex-col gap-5  h-full'>
            <InputTypeOne
                title="رمز عبور جدید"
                name="firstName"
                type="password"
                dir="ltr"
                placeholder=""
                // value={phoneNumber}
                // onChange={onChange}
                classNameTitle="mb-2 font-iranianSansDemiBold"
            />
            <InputTypeOne
                title="تکرار رمز عبور جدید"
                name="firstName"
                type="password"
                dir="ltr"
                placeholder=""
                // value={phoneNumber}
                // onChange={onChange}
                classNameTitle="mb-2 font-iranianSansDemiBold"
            />

            <button className='btn'>
                تایید
            </button>
        </div>
    )
}

export default NewPass