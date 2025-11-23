import React from 'react'
import Image from 'next/image';

const ImageSection = ({ src, alt, className }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <Image src={src} alt={alt} className="object-cover" fill priority quality={100} unoptimized/>
  </div>
);

export default ImageSection