// utils/customAlert.js
import Swal from 'sweetalert2';

// Base config for light theme with your colors
const baseConfig = {
  background: '#eefae8',
  color: '#00b894',
  confirmButtonColor: '#00b894',
  cancelButtonColor: '#b0db9c',
  iconColor: '#b0db9c',
  customClass: {
    popup: 'rounded-2xl shadow-lg',
    confirmButton: 'px-4 py-2 rounded-lg',
    cancelButton: 'px-4 py-2 rounded-lg',
  },
};

// General alert
export const showAlert = ({ title, text, icon = 'info', showCancelButton = false }) => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon,
    showCancelButton,
  });
};

// Success shortcut
export const showSuccess = (title, text) => {
  return showAlert({ title, text, icon: 'success' });
};

// Error shortcut
export const showError = (title, text) => {
  return showAlert({ title, text, icon: 'error' });
};

// Warning shortcut
export const showWarning = (title, text) => {
  return showAlert({ title, text, icon: 'warning' });
};

// Confirm alert (Yes/No)
export const showConfirm = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'تأیید',
    cancelButtonText: 'انصراف',
    reverseButtons: true,
  });
};

// ..................showAlert .....................

// import { showAlert } from '@/utils/customAlert';

// const handleSimpleAlert = () => {
//   showAlert({
//     title: 'سلام دنیا 🌍',
//     text: 'این یک پیام ساده است',
//     icon: 'info',
//   });
// };

// .................................................

// ..................showSuccess ......................
// import { showSuccess } from '@/utils/customAlert';

// const handleSuccess = () => {
//   showSuccess('عملیات موفق ✅', 'آیتم با موفقیت ذخیره شد.');
// };

// .................................................

// ..................showError ......................
// import { showError } from '@/utils/customAlert';

// const handleError = () => {
//   showError('خطا 🚫', 'مشکلی در ذخیره داده‌ها رخ داد.');
// };
// ..................................................


// ..................showConfirm ......................
// import { showConfirm } from '@/utils/customAlert';
// const handleDelete = async () => {
//   const result = await showConfirm('حذف آیتم 🗑️', 'آیا از حذف این مورد مطمئن هستید؟');
//   if (result.isConfirmed) {
//     console.log('کاربر تأیید کرد ✅');
//     // کد حذف رو اینجا اجرا کن
//   } else {
//     console.log('کاربر لغو کرد ❌');
//   }
// };
// .................................................