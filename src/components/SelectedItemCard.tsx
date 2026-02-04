"use client";

import { Minus } from "lucide-react";

interface SelectedItemCardProps {
  item: string;
  count: number;
  onRemove: (item: string) => void;
}

export default function SelectedItemCard({
  item,
  count,
  onRemove,
}: SelectedItemCardProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 flex items-center justify-center bg-[#FFC72C] rounded-full text-sm font-bold text-[#292929]">
          {count}
        </span>
        <span className="font-medium text-[#292929]">{item}</span>
      </div>
      <button
        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item);
        }}
        aria-label={`Remove ${item}`}
      >
        <Minus className="w-4 h-4 text-[#DA291C]" />
      </button>
    </div>
  );
}
