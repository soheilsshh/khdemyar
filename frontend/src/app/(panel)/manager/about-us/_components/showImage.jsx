import { Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

function ShowImageComponent({ src }) {
  return (
    <div className="relative overflow-hidden w-[200px] h-[250px] group rounded-lg">
      <Image src={src} alt="image" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Trash2 size={30} color="white" className="cursor-pointer" />
      </div>
    </div>
  );
}

export default ShowImageComponent;
