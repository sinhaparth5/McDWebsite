"use client";

import { Check, ShoppingBag } from "lucide-react";

interface ToastNotificationProps {
  showSelectedItem: boolean;
  showToast: boolean;
}

export default function ToastNotification({
  showSelectedItem,
  showToast,
}: ToastNotificationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {showSelectedItem && (
        <div
          className="flex items-center gap-3 px-4 py-3 bg-[#292929] text-white rounded-lg shadow-lg"
          role="alert"
        >
          <ShoppingBag className="w-5 h-5 text-[#FFC72C]" />
          <span className="text-sm font-medium">Added to order</span>
        </div>
      )}

      {showToast && (
        <div
          className="flex items-center gap-3 px-4 py-3 bg-[#264F36] text-white rounded-lg shadow-lg"
          role="alert"
        >
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">Order sent successfully!</span>
        </div>
      )}
    </div>
  );
}
