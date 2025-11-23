'use client';
import React, { useState, useRef } from 'react';
import { FaUpload, FaImage, FaTrash, FaEye, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const ImageUploader = ({
    title,
    currentImage,
    onImageChange,
    isEditing,
    aspectRatio = "16/9",
    maxSizeMB = 5,
    qualityNote = true,
    description
}) => {
    const [previewImage, setPreviewImage] = useState(currentImage);

    // Update preview when currentImage changes
    React.useEffect(() => {
        setPreviewImage(currentImage);
    }, [currentImage]);
    const [showPreview, setShowPreview] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        setError('');

        // File type validation
        if (!file.type.startsWith('image/')) {
            setError('لطفاً فقط فایل‌های تصویری انتخاب کنید.');
            return;
        }

        // File size validation
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            setError(`حجم فایل نباید بیشتر از ${maxSizeMB} مگابایت باشد.`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            setPreviewImage(imageUrl);
            if (onImageChange) {
                onImageChange(imageUrl, file);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onImageChange) {
            onImageChange(null, null);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Title and Description */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                {description && (
                    <p className="text-sm text-gray-600 mb-3">{description}</p>
                )}
                {qualityNote && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                        <FaExclamationTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-700">
                            <p className="font-medium mb-1">نکته مهم:</p>
                            <p>لطفاً عکس با کیفیت بالا و مطلوب انتخاب کنید. حجم فایل حداکثر {maxSizeMB} مگابایت باشد.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Area */}
            {isEditing && (
                <div className="space-y-4">
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isDragging
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                        />

                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUpload className="text-blue-500 text-xl" />
                            </div>

                            <div>
                                <p className="text-lg font-medium text-gray-700 mb-2">
                                    عکس را اینجا بکشید یا کلیک کنید
                                </p>
                                <p className="text-sm text-gray-500">
                                    فرمت‌های مجاز: JPG, PNG, GIF - حداکثر {maxSizeMB}MB
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openFileDialog}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                انتخاب فایل
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <FaTimes className="text-red-500" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Image Preview - Always Show */}
            <div className="space-y-4">
                <div className="relative group">
                    <div
                        className="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100"
                        style={{ aspectRatio }}
                    >
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt={title}
                                className="w-full z-50 h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <div className="text-center text-gray-500">
                                    <FaImage className="text-2xl md:text-3xl mb-2 mx-auto opacity-50" />
                                    <p className="text-xs md:text-sm">تصویر انتخاب نشده</p>
                                </div>
                            </div>
                        )}

                        {/* Overlay - Only show if image exists */}
                        {previewImage && (
                            <div className="absolute inset-0 bg-black/50 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-3">
                                    <button
                                        onClick={() => setShowPreview(true)}
                                        className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
                                    >
                                        <FaEye className="text-gray-700" />
                                    </button>

                                    {isEditing && (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="p-3 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
                                        >
                                            <FaTrash className="text-white" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Image Info */}
                    <div className="mt-2 text-sm text-gray-600 text-center">
                        {previewImage ? (
                            <>
                                <FaCheck className="inline text-green-500 mr-1" />
                                تصویر بارگذاری شده
                            </>
                        ) : (
                            <>
                                <FaImage className="inline text-gray-400 mr-1" />
                                تصویر انتخاب نشده
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Screen Preview Modal */}
            {showPreview && previewImage && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                        <div className='w-150 h-150 justify-center items-center'>
                            <img
                                src={previewImage}
                                alt={title}
                                className="object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
