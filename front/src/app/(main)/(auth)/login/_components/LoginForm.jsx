"use client"
import InputTypeOne from '@/components/InputTypeOne'
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

import React from 'react'

function LoginForm() {
    const router = useRouter();
    
    const handleLogin = async () => {
        const result = await Swal.fire({
            title: 'انتخاب پنل 🎯',
            text: 'به کدام پنل می‌خواهید وارد شوید؟',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'پنل مدیریت',
            cancelButtonText: 'پنل خادمیار',
            confirmButtonColor: '#00b894',
            cancelButtonColor: '#b0db9c',
            background: '#eefae8',
            color: '#00b894',
            customClass: {
                popup: 'rounded-2xl shadow-lg',
                confirmButton: 'px-4 py-2 rounded-lg',
                cancelButton: 'px-4 py-2 rounded-lg',
            },
            reverseButtons: true,
        });
        
        if (result.isConfirmed) {

            router.push("/manager/profile");
        } else {

            router.push("/user/profile");
        }
    };

    return (
        <div className='flex flex-col gap-3 '>
            <InputTypeOne
                title="نام کاربری یا شماره تلفن"
                name="firstName"
                type="text"
                dir="ltr"
                placeholder="09212981392"
                // value={phoneNumber}
                // onChange={onChange}
                classNameTitle="mb-2 font-iranianSansDemiBold"
            />
            <InputTypeOne
                title="رمز عبور"
                name="firstName"
                type="password"
                dir="ltr"
                placeholder=""
                // value={phoneNumber}
                // onChange={onChange}
                classNameTitle="mb-2 font-iranianSansDemiBold"
            />

            <button onClick={handleLogin} className='btn mt-2 '>
                ورود
            </button>

        </div>
    )
}

export default LoginForm