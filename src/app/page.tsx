"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { sendOrderEmails } from "@/lib/send-email";
import MenuItem from "@/components/MenuItem";
import SelectedItemCard from "@/components/SelectedItemCard";
import ToastNotification from "@/components/ToastNotification";
import { menuItems } from "@/data/menuItems";

const CURRENT_YEAR = 2026;

export default function Home() {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {},
  );
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showSelectedItem, setShowSelectedItem] = useState<boolean>(false);
  const [toastTimeout, setToastTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [selectedItemTimeout, setSelectedItemTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleItemClick = (itemName: string) => {
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      newItems[itemName] = (newItems[itemName] || 0) + 1;
      return newItems;
    });
    setShowSelectedItem(true);

    if (selectedItemTimeout) clearTimeout(selectedItemTimeout);
    const timeout = setTimeout(() => {
      setShowSelectedItem(false);
    }, 2000);
    setSelectedItemTimeout(timeout);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedItems).length === 0) {
      alert("Please select at least one item before ordering.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendOrderEmails({
        items: selectedItems,
        comment: textareaValue,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to send order");
      }

      setShowToast(true);
      if (toastTimeout) clearTimeout(toastTimeout);

      setSelectedItems({});
      setTextareaValue("");

      const timeout = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      setToastTimeout(timeout);
    } catch (error) {
      console.error("Error sending order:", error);
      alert("Failed to send order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (itemName: string) => {
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[itemName]) {
        newItems[itemName] -= 1;
        if (newItems[itemName] <= 0) {
          delete newItems[itemName];
        }
      }
      return newItems;
    });
    if (
      Object.keys(selectedItems).length === 1 &&
      selectedItems[itemName] === 1
    ) {
      setShowSelectedItem(false);
    }
  };

  const totalItems = Object.values(selectedItems).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <main className="min-h-screen bg-[#F6F6F6]">
      <ToastNotification
        showSelectedItem={showSelectedItem}
        showToast={showToast}
      />

      {/* Header */}
      <header className="bg-[#DA291C] py-4">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/products/logo.jpg"
                alt="Headington's Menu"
                fill
                sizes="40px"
                className="object-contain rounded"
              />
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              Headington&apos;s Menu
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#FFC72C] px-4 py-2 rounded-full">
            <ShoppingBag className="w-5 h-5 text-[#292929]" />
            <span className="font-bold text-[#292929]">{totalItems}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#292929]">Beverages</h1>
          <p className="text-gray-600 mt-1">Select your drinks</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.name}
                  name={item.name}
                  image={item.image}
                  onClick={handleItemClick}
                />
              ))}
            </div>
          </div>

          {/* Order Panel */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#292929]">
                    Your Order
                  </h2>
                  <span className="bg-[#FFC72C] px-3 py-1 rounded-full text-sm font-bold text-[#292929]">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              {/* Selected Items */}
              <div className="p-4 min-h-[200px]">
                {Object.keys(selectedItems).length > 0 ? (
                  Object.entries(selectedItems).map(([item, count]) => (
                    <SelectedItemCard
                      key={item}
                      item={item}
                      count={count}
                      onRemove={handleRemoveItem}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Coffee className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">
                      Your order is empty. Select items from the menu.
                    </p>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="p-4 border-t border-gray-200">
                <Label
                  htmlFor="message"
                  className="text-sm font-medium text-[#292929]"
                >
                  Special Instructions
                </Label>
                <Textarea
                  value={textareaValue}
                  onChange={handleTextareaChange}
                  placeholder="Any special requests?"
                  id="message"
                  className="mt-2 text-sm resize-none border-gray-200 focus:border-[#FFC72C] focus:ring-[#FFC72C]"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="p-4 border-t border-gray-200">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || Object.keys(selectedItems).length === 0
                  }
                  className="w-full bg-[#DA291C] hover:bg-[#bb2318] text-white font-bold py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#292929] mt-16 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/products/logo.jpg"
                  alt="McDonald's"
                  fill
                  sizes="32px"
                  className="object-contain rounded"
                />
              </div>
              <span className="text-white font-bold">McDonald&apos;s</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {CURRENT_YEAR} McDonald&apos;s. All rights reserved.
            </p>
            <span className="text-[#FFC72C] text-sm font-medium">
              i&apos;m lovin&apos; it
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
