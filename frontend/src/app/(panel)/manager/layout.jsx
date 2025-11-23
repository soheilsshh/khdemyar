import React from 'react'
import Navbar from '../_components/Navbar'
import SideBar from '../_components/SideBar'

import { FaRegListAlt } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { RiProfileLine } from "react-icons/ri";

import { MdOutlineAssignmentInd } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlinePending } from "react-icons/md";
import { MdOutlineDisplaySettings } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri";


function layout({ children }) {

    const items = [
        {
            id: 4,
            name: "پروفایل",
            icon: <RiProfileLine size={20} />,
            section: ["profile"],
            link: "/manager/profile"
        },
        {
            id: 1,
            name: "درخواست‌های ثبت‌نام",
            icon: <FaRegListAlt size={20} />,
            link: "/manager/registration-requests/all",
            section: ["registration-requests"],
            subMenu: [
                {
                    id: 1,
                    name: "همه درخواست ها",
                    icon: <MdOutlineAssignmentInd size={16} />,
                    link: "/manager/registration-requests/all",
                },
                {
                    id: 2,
                    name: "درخواست های رد شده",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/registration-requests/rejected",
                },

                {
                    id: 3,
                    name: "برسی نشده",
                    icon: <MdOutlinePending size={16} />,
                    link: "/manager/registration-requests/pending",
                },
            ]
        },
        {
            id: 2,
            name: "خادمیاران",
            icon: <LuUsers size={20} />,
            section: ["users"],
            link: "/manager/users/all-users",
            subMenu: [
                {
                    id: 1,
                    name: "همه خادمیاران",
                    icon: <MdOutlineAssignmentInd size={16} />,
                    link: "/manager/users/all-users",
                },
                {
                    id: 2,
                    name: "خادمیاران درحال خدمت",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/users/active-users",
                },

            ]
        },
        {
            id: 3,
            name: "مدیریت شیفت‌ها ",
            icon: <SlCalender size={20} />,
            link: "/manager/shift-management/create-shift",
            section: ["shift-management"],
            subMenu: [
                {
                    id: 1,
                    name: "ایجاد شیفت جدید",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/shift-management/create-shift",
                },
                {
                    id: 2,
                    name: "شیفت های جاری",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/shift-management/active-shifts",
                },
                {
                    id: 1,
                    name: "همه شیفت ها",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/shift-management/all-shifts",
                },
            ]
        },
        {
            id: 5,
            name: "مدیریت سایت",
            icon: <MdOutlineDisplaySettings size={20} />,
            section: ["dashboard", "news", "gallery", "subtitle", "feedback" , "about-us", "calendar", "contact-us", "home-page"],
            link: "/manager/dashboard",
            subMenu: [
                {
                    id: 1,
                    name: "داشبورد",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/dashboard",
                },
                {
                    id: 2,
                    name: "اخبار",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/news",
                },
                {
                    id: 3,
                    name: "گالری",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/gallery",
                },
                {
                    id: 4,
                    name: "زیرنویس",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/subtitle",
                },
                {
                    id: 5,
                    name: "درباره ما",
                    icon: <RiArticleLine size={16} />,
                    link: "/manager/about-us",
                },
                {
                    id: 6,
                    name: "بازخورد ها",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/feedback",
                },
                {
                    id: 7,
                    name: "مدیریت تقویم",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/calendar",
                },
                {
                    id: 8,
                    name: "تماس باما",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/contact-us",
                },
                {
                    id: 9,
                    name: "صفحه اصلی",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/home-page",
                },
            ]
        },
        {
            id: 6,
            name: "مدیریت مدیران",
            icon: <MdOutlineDisplaySettings size={20} />,
            section: ["managers","add-manager","all-managers"],
            link: "/manager/managers/all-managers",
            subMenu: [
                {
                    id: 1,
                    name: "همه مدیران",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/managers/all-managers",
                },
                {
                    id: 2,
                    name: "افزودن مدیر",
                    icon: <CiCircleRemove size={16} />,
                    link: "/manager/managers/add-manager",
                },
            ]
        },
        
    ]

    return (
        <div dir='rtl' className='flex min-h-screen bg-dThird '>
            <SideBar items={items} />
            <div className='flex-1 flex flex-col lg:mr-60'>
                {/* <Navbar /> */}
                <div className='flex-1 pt-10 sm:pt-5'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout