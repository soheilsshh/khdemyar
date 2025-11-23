"use client";
import React, { useReducer, useRef } from "react";
import InputTypeOne from "@/components/InputTypeOne";
import TextAreaTypeOne from "@/components/TextAreaTypeOne";
import ImageUploader from "@/components/ImageUploader";
import SelectTypeOne from "@/components/SelectTypeOne";
import { useReactToPrint } from "react-to-print";

const fields = [
    {
        required: false,
        title: "تصویر پروفایل",
        name: "profileImage",
        type: "image",
        defaultValue: "/images/image-3.jpg"
    },
    {
        required: false,
        title: "وضعیت",
        name: "status",
        defaultValue: "در حال برسی"
    },
    {
        required: true,
        title: "نام کاربری",
        name: "username",
        placeholder: "username",
        defaultValue: "peyman123"
    },
    {
        required: true,
        title: "رمز عبور",
        name: "password",
        placeholder: "رمز عبور",
        type: "password",
        dir: "ltr",
        defaultValue: "Password123!"
    },
    {
        required: true,
        title: "تکرار رمز عبور",
        name: "confirmPassword",
        placeholder: "تکرار رمز عبور",
        type: "password",
        dir: "ltr",
        defaultValue: "Password123!"
    },
    {
        required: true,
        title: "نام",
        name: "firstName",
        placeholder: "پیمان",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3",
        defaultValue: "پیمان"
    },
    {
        required: true,
        title: "نام خانوادگی",
        name: "lastName",
        placeholder: "اکبری",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "اکبری"
    },
    {
        required: true,
        title: "نام پدر",
        name: "fatherName",
        placeholder: "محمد",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "محمد"
    },
    {
        required: true,
        title: "محل تولد",
        name: "birthPlace",
        placeholder: "شاهرود",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "شاهرود"
    },
    {
        required: true,
        title: "تاریخ تولد",
        name: "birthDate",
        placeholder: "مثلاً 1370/01/01",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "1370/01/01"
    },
    {
        required: true,
        title: "جنسیت",
        name: "gender",
        placeholder: "مرد",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        type: "select",
        options: [
            { text: "مرد", value: "man" },
            { text: "زن", value: "woman" }
        ],
        defaultValue: "man"
    },
    {
        required: true,
        title: "نظام وظیفه",
        name: "militaryStatus",
        placeholder: "پایان خدمت",
        className: "col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        type: "select",
        options: [
            { text: "پایان خدمت", value: "End of service" },
            { text: "معافیت دائمی", value: "Permanent exemption" },
            { text: "معافیت موقت", value: "Temporary exemption" },
            { text: "انجام خدمت وظیفه", value: "Doing military service" }
        ],
        defaultValue: "End of service"
    },
    {
        required: true,
        title: "شماره شناسنامه",
        name: "identityNumber",
        placeholder: "۲۴۲۳۵۳۴۵۳",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        dir: "ltr",
        defaultValue: "242353453"
    },
    {
        required: true,
        title: "کد ملی",
        name: "nationalCode",
        placeholder: "۰۴۵۸۴۶۷۱۰۴",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        dir: "ltr",
        defaultValue: "0458467104"
    },
    {
        required: true,
        title: "وضعیت تاهل",
        name: "maritalStatus",
        placeholder: "انتخاب کنید",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        type: "select",
        options: [
            { text: "مجرد", value: "single" },
            { text: "متاهل", value: "married" }
        ],
        defaultValue: "single"
    },
    {
        required: true,
        title: "تعداد فرزندان",
        name: "childrenCount",
        placeholder: "0",
        className: " col-span-full sm:col-span-6 xl:col-span-2 print:col-span-2 ",
        type: "select",
        options: [
            { text: "0", value: 0 },
            { text: "1", value: 1 },
            { text: "2", value: 2 },
            { text: "3", value: 3 },
            { text: "4", value: 4 },
            { text: "5", value: 5 },
            { text: "6", value: 6 },
            { text: "7", value: 7 },
            { text: "8", value: 8 },
            { text: "9", value: 9 }
        ],
        defaultValue: 0
    },
    {
        required: true,
        title: "میزان تحصیلات",
        name: "educationLevel",
        placeholder: "لیسانس",
        className: " col-span-full sm:col-span-6 xl:col-span-2 print:col-span-2 ",
        type: "select",
        options: [
            { text: "هیچکدام", value: 0 },
            { text: "سیکل", value: 1 },
            { text: "دیپلم", value: 2 },
            { text: "کارشناسی", value: 3 },
            { text: "ارشد", value: 4 },
            { text: "دکتری", value: 5 }
        ],
        defaultValue: 3
    },
    {
        required: true,
        title: "رشته تحصیلی",
        name: "fieldOfStudy",
        placeholder: "کامپیوتر",
        className: " col-span-full sm:col-span-6 xl:col-span-2 print:col-span-2 ",
        defaultValue: "مهندسی کامپیوتر"
    },
    {
        required: true,
        title: "ملیت",
        name: "nationality",
        placeholder: "ایرانی",
        className: " col-span-full sm:col-span-6 xl:col-span-2 print:col-span-2 ",
        defaultValue: "ایرانی"
    },
    {
        required: true,
        title: "دین",
        name: "religion",
        placeholder: "اسلام",
        className: " col-span-full sm:col-span-6 xl:col-span-2 print:col-span-2 ",
        defaultValue: "اسلام"
    },
    {
        required: true,
        title: "مذهب",
        name: "sect",
        placeholder: "شیعه",
        className: " col-span-full sm:col-span-6 xl:col-span-2 print:col-span-2 ",
        defaultValue: "شیعه"
    },
    {
        required: false,
        title: "شماره همراه فضای مجازی",
        name: "virtualPhone",
        dir: "ltr",
        placeholder: "09123456789",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "09123456789"
    },
    {
        required: true,
        title: "شغل فعلی",
        name: "currentJob",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "برنامه‌نویس"
    },
    {
        required: false,
        title: "نشانی کامل محل کار",
        name: "workAddress",
        placeholder: "-",
        className: " col-span-full xl:col-span-9 print:col-span-9  ",
        defaultValue: "تهران، خیابان آزادی، پلاک ۱۲۳"
    },
    {
        required: false,
        title: "شماره تماس محل کار",
        name: "workPhone",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "02112345678"
    },
    {
        required: false,
        title: "شماره منزل",
        name: "homePhone",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "02187654321"
    },
    {
        required: true,
        title: "آدرس محل سکونت",
        name: "homeAddress",
        placeholder: "-",
        className: " col-span-full sm:col-span-12 xl:col-span-9 print:col-span-9  ",
        defaultValue: "تهران، خیابان ولیعصر، کوچه بهار، پلاک ۴۵"
    },
    {
        required: false,
        title: "نام و نام خانوادگی معرف اول",
        name: "ref1Name",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "علی رضایی"
    },
    {
        required: false,
        title: "شماره تماس معرف اول",
        name: "ref1Phone",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "09198765432"
    },
    {
        required: false,
        title: "نام و نام خانوادگی معرف دوم",
        name: "ref2Name",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "حسن محمدی"
    },
    {
        required: false,
        title: "شماره تماس معرف دوم",
        name: "ref2Phone",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        defaultValue: "09187654321"
    },
    {
        required: false,
        title: "سابقه فعالیت مذهبی",
        name: "religiousBackground",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        type: "textArea",
        defaultValue: "شرکت در مراسمات مذهبی مساجد"
    },
    {
        required: false,
        title: "بیماری یا معلولیت خاص",
        name: "disability",
        placeholder: "-",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        type: "textArea",
        defaultValue: "ندارد"
    },
    {
        required: false,
        title: "سوء پیشینه",
        name: "criminalRecord",
        placeholder: "ندارد",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        type: "textArea",
        defaultValue: "ندارد"
    },
    {
        required: false,
        title: "مهارت یا تخصص",
        name: "skills",
        placeholder: "برنامه‌نویسی",
        className: " col-span-full sm:col-span-6 xl:col-span-3 print:col-span-3 ",
        type: "textArea",
        defaultValue: "برنامه‌نویسی، طراحی وب"
    }
];

const initialState = Object.fromEntries(
    fields.map((field) => [field.name, field.defaultValue ?? " "])
);

function reducer(state, action) {
    switch (action.type) {
        case "CHANGE":
            return { ...state, [action.name]: action.value };
        default:
            return state;
    }
}



function UserInfoForm() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const formRef = useRef();
    const handleChange = (e) => {
        dispatch({ type: "CHANGE", name: e.target.name, value: e.target.value });
    };

    const handleImageChange = (name, file) => {
        dispatch({ type: "CHANGE", name, value: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted: ", state);
    };

    const handlePrint = useReactToPrint({
        contentRef: formRef, 
        documentTitle: "UserForm",
    });
    return (
        <form dir="rtl" ref={formRef} onSubmit={handleSubmit} className=" w-full h-full flex flex-col items-center p-5 pt-0">
            {/* <div className="text-center text-3xl font-iranianSansHeavy text-gray-700">
                همه خادم الرضاییم
            </div>

            <p className="mt-7 sm:text-xl max-sm:text-justify font-iranianSansDemiBold">
                لطفا جهت پذیرش شما در جمع خادمین چایخانه موارد ذیل را پر کنید
            </p> */}

            <div className="grid w-full max-w-6xl mt-7 grid-cols-12 gap-5">
                {fields.map((field, index) => {
                    if (index < 5) return null
                    if (field.type === "image") return null;

                    if (field.type === "textArea") {
                        return (
                            <TextAreaTypeOne
                                key={field.name}
                                required={field.required}
                                pClassName={field.className}
                                title={field.title}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={state[field.name]}
                                onChange={handleChange}
                                resize={true}
                                classNameTitle="mb-2 font-iranianSansDemiBold"
                            />
                        );
                    }

                    if (field.type === "select") {
                        return (
                            <SelectTypeOne
                                key={field.name}
                                required={field.required}
                                pClassName={field.className}
                                title={field.title}
                                name={field.name}
                                value={state[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                options={field.options || []}
                                classNameTitle="mb-2 font-iranianSansDemiBold"
                                sClassName="bg-white shadow-gray-400"
                            />
                        );
                    }

                    return (
                        <InputTypeOne
                            key={field.name}
                            required={field.required}
                            pClassName={field.className}
                            title={field.title}
                            name={field.name}
                            type={field.type || "text"}
                            dir={field.dir || "rtl"}
                            value={state[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            classNameTitle="mb-2 font-iranianSansDemiBold"
                        />
                    );
                })}

                <div className="col-span-full grid grid-cols-12 gap-5">
                    <ImageUploader
                        cClassName="col-span-full max-md:p-5 lg:col-span-3 print:col-span-3 h-full flex flex-col"
                        className="flex-1 max-md:min-h-60 min-h-50 md:w-full"
                        bClassName="w-full h-11"
                        value={state.profileImage}
                        onChange={(file) => handleImageChange("profileImage", file)}
                    />

                    <div className="col-span-full print:col-span-9 lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-5">
                        <InputTypeOne
                            pClassName=" col-span-2"
                            required
                            title="نام کاربری"
                            name="username"
                            dir="ltr"
                            value={state.username}
                            onChange={handleChange}
                            classNameTitle="mb-2 font-iranianSansDemiBold"
                        />
                        <InputTypeOne
                            pClassName=" col-span-2"
                            required
                            title="تاریخ ثبت نام"
                            name="username"
                            disabled={true}
                            dir="ltr"
                            value={state.username}
                            onChange={handleChange}
                            classNameTitle="mb-2 font-iranianSansDemiBold"
                        />
                        <InputTypeOne
                            pClassName=" col-span-2"
                            required
                            title="وضعیت"
                            disabled={true}
                            name="username"
                            value={state.status}
                            onChange={handleChange}
                            classNameTitle="mb-2 font-iranianSansDemiBold"
                        />
                        <InputTypeOne
                            pClassName=" col-span-2"
                            required
                            title="تایید شده توسط"
                            disabled={true}
                            name="username"
                            value={state.username}
                            onChange={handleChange}
                            classNameTitle="mb-2 font-iranianSansDemiBold"
                        />

                        <div className="flex print:hidden  justify-end items-end">
                            <button
                                type="submit"
                                className="cursor-pointer shadow-xl h-11 w-full bg-red-700 p-3 text-white rounded-lg"
                            >
                                حذف
                            </button>
                        </div>

                        <div className="flex print:hidden  justify-end items-end">
                            <button
                                type="submit"
                                className="cursor-pointer shadow-xl h-11 w-full bg-green-700 p-3 text-white rounded-lg"
                            >
                                تایید
                            </button>
                        </div>
                        <div className="flex print:hidden justify-end items-end">
                            <button
                                type="submit"
                                className="cursor-pointer shadow-xl h-11 w-full bg-cyan-700 p-3 text-white rounded-lg"
                            >
                                ثبت تغییرات
                            </button>
                        </div>
                        <div className="flex print:hidden justify-end  items-end">
                            <button
                                type="button"
                                onClick={() => handlePrint()}
                                className="cursor-pointer shadow-xl h-11 w-full bg-cyan-700 p-3 text-white rounded-lg"
                            >
                                چاپ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default UserInfoForm;
