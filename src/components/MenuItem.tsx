"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

interface MenuItemProps {
  name: string;
  image: string;
  onClick: (itemName: string) => void;
}

export default function MenuItem({ name, image, onClick }: MenuItemProps) {
  return (
    <div
      className="group bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-[#FFC72C] hover:shadow-md transition-all duration-200"
      onClick={() => onClick(name)}
    >
      <div className="relative h-36 bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-[#FFC72C] rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus className="w-4 h-4 text-[#292929]" />
        </div>
      </div>
      <div className="p-3 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-[#292929] text-center">
          {name}
        </h3>
      </div>
    </div>
  );
}
