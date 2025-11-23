"use client"
import React, { useReducer } from 'react';
import InputTypeOne from '@/components/InputTypeOne';

const initialState = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'FIELD_CHANGE':
            return {
                ...state,
                [action.field]: action.value,
            };
        default:
            return state;
    }
}

function SendFeedback() {
    const [state, dispatch] = useReducer(reducer, initialState);

        const handleChange = (e) => {
            dispatch({
                type: 'FIELD_CHANGE',
                field: e.target.name,
                value: e.target.value,
            });
        };

    return (
        <div className="col-span-12  xl:col-span-4 gap-2 gap-x-4 grid grid-cols-2">
            <div className='col-span-2 mb-4 font-iranianSansDemiBold text-xl'>
                ارسال بازخورد
            </div>
            <InputTypeOne
                title="نام"
                required={true}
                name="firstName"
                value={state.firstName}
                onChange={handleChange}
            />

            <InputTypeOne
                title="نام خانوادگی"
                required={true}
                name="lastName"
                value={state.lastName}
                onChange={handleChange}
            />

            <InputTypeOne
                title="شماره تماس"
                required={true}
                name="phone"
                value={state.phone}
                onChange={handleChange}
            />

            <InputTypeOne
                title="ایمیل"
                name="email"
                value={state.email}
                onChange={handleChange}
            />

            <div className="col-span-2">
                <div className="flex gap-2">
                    <div>متن پیام</div>
                    <div className="text-red-600 translate-y-1 font-bold">*</div>
                </div>
                <textarea
                    name="message"
                    value={state.message}
                    onChange={handleChange}
                    required
                    className="w-full min-h-40 shadow-md bg-gray-100 rounded-lg resize-none outline-none p-3"
                />
            </div>

            <button className='col-span-2 bg-green-600 text-white rounded-lg shadow-xl h-11'>
                    ارسال بازخورد
            </button>
        </div>
    );
}

export default SendFeedback;
