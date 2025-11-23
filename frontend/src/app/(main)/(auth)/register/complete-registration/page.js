"use client";
import React, { useReducer } from "react";
import InputTypeOne from "@/components/InputTypeOne";
import TextAreaTypeOne from "@/components/TextAreaTypeOne";
import ImageUploader from "@/components/ImageUploader";
import SelectTypeOne from "@/components/SelectTypeOne";

const fields = [
  {
    required: false,
    title: "تصویر پروفایل",
    name: "profileImage",
    type: "image",
  },
  {
    required: true,
    title: "نام کاربری",
    name: "username",
    placeholder: "username",
  },
  {
    required: true,
    title: "رمز عبور",
    name: "password",
    placeholder: "رمز عبور",
    type: "password",
    dir: "ltr",
  },
  {
    required: true,
    title: "تکرار رمز عبور",
    name: "confirmPassword",
    placeholder: "تکرار رمز عبور",
    type: "password",
    dir: "ltr",
  },
  {
    required: true,
    title: "نام",
    name: "firstName",
    placeholder: "پیمان",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: true,
    title: "نام خانوادگی",
    name: "lastName",
    placeholder: "اکبری",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: true,
    title: "نام پدر",
    name: "fatherName",
    placeholder: "محمد",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: true,
    title: "محل تولد",
    name: "birthPlace",
    placeholder: "شاهرود",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: true,
    title: "تاریخ تولد",
    name: "birthDate",
    placeholder: "مثلاً 1370/01/01",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: true,
    title: "جنسیت",
    name: "gender",
    placeholder: "مرد",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    type: "select",
    options: [
      { text: "مرد", value: "man" },
      { text: "زن", value: "woman" },
    ],
  },
  {
    required: true,
    title: "نظام وظیفه",
    name: "militaryStatus",
    placeholder: "پایان خدمت",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    type: "select",
    options: [
      { text: "پایان خدمت", value: "End of service" },
      { text: "معافیت دائمی", value: "Permanent exemption" },
      { text: "معافیت موقت", value: "Temporary exemption" },
      { text: "انجام خدمت وظیفه", value: "Doing military service" },
    ],
  },
  // {
  //   required: true,
  //   title: "سن",
  //   name: "age",
  //   placeholder: "30",
  //   className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  // },
  {
    required: true,
    title: "شماره شناسنامه",
    name: "identityNumber",
    placeholder: "۲۴۲۳۵۳۴۵۳",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    dir: "ltr",
  },
  {
    required: true,
    title: "کد ملی",
    name: "nationalCode",
    placeholder: "۰۴۵۸۴۶۷۱۰۴",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    dir: "ltr",
  },
  {
    required: true,
    title: "وضعیت تاهل",
    name: "maritalStatus",
    placeholder: "انتخاب کنید",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    type: "select",
    options: [
      { text: "مجرد", value: "single" },
      { text: "متاهل", value: "married" },
    ],
  },
  {
    required: true,
    title: "تعداد فرزندان",
    name: "childrenCount",
    placeholder: "0",
    className: " col-span-full sm:col-span-4 lg:col-span-2 ",
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
      { text: "9", value: 9 },
    ],
  },

  {
    required: true,
    title: "میزان تحصیلات",
    name: "educationLevel",
    placeholder: "لیسانس",
    className: " col-span-full sm:col-span-4 lg:col-span-2 ",
    type: "select",
    options: [
      { text: "هیچکدام", value: 0 },
      { text: "سیکل", value: 1 },
      { text: "دیپلم", value: 2 },
      { text: "کارشناسی", value: 3 },
      { text: "ارشد", value: 4 },
      { text: "دکتری", value: 5 },
    ],
  },
  {
    required: true,
    title: "رشته تحصیلی",
    name: "fieldOfStudy",
    placeholder: "کامپیوتر",
    className: " col-span-full sm:col-span-4 lg:col-span-2 ",
  },
  {
    required: true,
    title: "ملیت",
    name: "nationality",
    placeholder: "ایرانی",
    className: " col-span-full sm:col-span-6 lg:col-span-2 ",
  },
  {
    required: true,
    title: "دین",
    name: "religion",
    placeholder: "اسلام",
    className: " col-span-full sm:col-span-6 lg:col-span-2 ",
  },
  {
    required: true,
    title: "مذهب",
    name: "sect",
    placeholder: "شیعه",
    className: " col-span-full sm:col-span-6 lg:col-span-2 ",
  },
  {
    required: false,
    title: "شماره همراه فضای مجازی",
    name: "virtualPhone",
    dir:"ltr",
    placeholder: "09123456789",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: true,
    title: "شغل فعلی",
    name: "currentJob",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: false,
    title: "نشانی کامل محل کار",
    name: "workAddress",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-9 ",
  },
  {
    required: false,
    title: "شماره تماس محل کار",
    name: "workPhone",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: false,
    title: "شماره منزل",
    name: "homePhone",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: true,
    title: "آدرس محل سکونت",
    name: "homeAddress",
    placeholder: "-",
    className: " col-span-full sm:col-span-12 lg:col-span-9 ",
  },

  {
    required: false,
    title: "نام و نام خانوادگی معرف اول",
    name: "ref1Name",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: false,
    title: "شماره تماس معرف اول",
    name: "ref1Phone",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: false,
    title: "نام و نام خانوادگی معرف دوم",
    name: "ref2Name",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: false,
    title: "شماره تماس معرف دوم",
    name: "ref2Phone",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
  },
  {
    required: false,
    title: "سابقه فعالیت مذهبی",
    name: "religiousBackground",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    type: "textArea",
  },
  {
    required: false,
    title: "بیماری یا معلولیت خاص",
    name: "disability",
    placeholder: "-",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    type: "textArea",
  },
  {
    required: false,
    title: "سوء پیشینه",
    name: "criminalRecord",
    placeholder: "ندارد",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    type: "textArea",
  },
  {
    required: false,
    title: "مهارت یا تخصص",
    name: "skills",
    placeholder: "برنامه‌نویسی",
    className: " col-span-full sm:col-span-6 lg:col-span-3 ",
    type: "textArea",
  },
];

const initialState = Object.fromEntries(
  fields.map((field) => [field.name, ""])
);

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.name]: action.value };
    default:
      return state;
  }
}

function Page() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    dispatch({ type: "CHANGE", name: e.target.name, value: e.target.value });
  };

  return (
    <div className="w-full h-full justify-center items-center flex flex-col">
      <div className="w-full text-gray-700 text-center text-3xl font-iranianSansHeavy ">
        همه خادم الرضاییم
      </div>
      <div className="mt-7 sm:text-xl max-sm:text-justify font-iranianSansDemiBold">
        لطفا جهت پذیرش شما در جمع خادمین چایخانه موارد ذیل را پر کنید
      </div>
      <div className="grid w-full max-w-6xl mt-7 grid-cols-12 gap-5">
        {fields.map((field, index) => {
          if (index < 4) {
            return;
          }
          if (field.type === "textArea") {
            return (
              <TextAreaTypeOne
                required={field.required}
                key={index}
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
                required={field.required}
                key={index}
                pClassName={field.className}
                title={field.title}
                name={field.name}
                classNameTitle="mb-2 font-iranianSansDemiBold"
                sClassName=" bg-white shadow-gray-400"
                value={state[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                options={field.options || []}
              />
            );
          }

          return (
            <InputTypeOne
              required={field.required}
              key={index}
              pClassName={field.className}
              title={field.title}
              name={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              dir={field.dir || "rtl"}
              value={state[field.name]}
              onChange={handleChange}
              classNameTitle="mb-2 font-iranianSansDemiBold"
            />
          );
        })}

        <div className="col-span-full grid grid-cols-12 gap-5">
          <ImageUploader
            cClassName=" col-span-full max-md:p-5 md:col-span-3 h-full flex flex-col"
            className="flex-1 max-md:min-h-50  md:w-full"
            bClassName="w-full h-11"
            value={state.profileImage}
            onChange={(file) =>
              dispatch({
                type: "CHANGE",
                name: "profileImage",
                value: file,
              })
            }
          />

          <div className="col-span-full md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputTypeOne
              required
              title="نام کاربری"
              name="username"
              dir="ltr"
              value={state.username}
              onChange={handleChange}
              classNameTitle="mb-2 font-iranianSansDemiBold"
            />

            <InputTypeOne
              dir="ltr"
              type="password"
              required
              title="رمز عبور"
              name="password"
              value={state.password}
              onChange={handleChange}
              classNameTitle="mb-2 font-iranianSansDemiBold"
            />

            <InputTypeOne
              dir="ltr"
              type="password"
              required
              title="تکرار رمز عبور"
              name="confirmPassword"
              value={state.confirmPassword}
              onChange={handleChange}
              classNameTitle="mb-2 font-iranianSansDemiBold"
            />

            <div className="flex justify-end items-end">
              <button className=" cursor-pointer shadow-lg h-11  w-full bg-green-700 p-3 text-white rounded-lg">
                تکمیل ثبت نام
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
