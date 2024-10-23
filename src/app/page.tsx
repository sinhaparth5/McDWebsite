"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RocketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

export default function Home() {
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
    const [textareaValue, setTextareaValue] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [showSelectedItem, setShowSelectedItem] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timmer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timmer);
    }, []);

    const handleItemClick = (itemName: string) => {
        setSelectedItems((prevItems) => {
            const newItems = { ...prevItems };
            newItems[itemName] = (newItems[itemName] || 0) + 1;
            return newItems;
        });
        setShowSelectedItem(true);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.target.value);
    };

    const handleTextareaClick = () => {
        const divValue = "N/A";
        setTextareaValue(divValue);
    };

    const handleSubmit = async () => {
        const formattedItems = Object.entries(selectedItems).map(
            ([itemName, count]) => `${count}x ${itemName}`
        ).join(', ');

        const data = {
            item_name: formattedItems,
            comment: textareaValue,
        };

        try {
            const response = await fetch('https://mcdonalds-backend-production.up.railway.app/api/v1/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Show the toast notification
            setShowToast(true);

            // Clear the selected items and comments after successful submission
            setSelectedItems({});
            setTextareaValue('');

            // Hide the toast notification after 5 seconds
            setTimeout(() => {
                setShowToast(false);
                setShowSelectedItem(false);
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
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
        if (Object.keys(selectedItems).length === 1) {
            setShowSelectedItem(false);
        }
    };

    const renderSelectedItems = () => {
        return Object.entries(selectedItems).map(([item, count]) => (
            <div key={item} className="flex justify-between w-full items-center">
                <span>{count}x {item}</span>
                <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(item)}
                >
                    Remove
                </button>
            </div>
        ));
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {showSelectedItem && (
                <div id="toast-default"
                     className={`sticky top-16 flex items-center w-full max-w-xs p-4 text-black bg-green-400 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${isVisible? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                     role="alert">
                    <div
                        className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-950 bg-green-400 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 18 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"/>
                        </svg>
                        <span className="sr-only">Fire icon</span>
                    </div>
                    <div className="ms-3 text-sm font-normal">Item Added</div>
                </div>
            )}
            {showToast && (
                <div id="toast-simple"
                     className={`flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-black bg-green-400 divide-x rtl:divide-x-reverse divide-black rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800 ${isVisible? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                     role="alert">
                    <svg className="w-5 h-5 text-black dark:text-blue-500 rotate-45" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"/>
                    </svg>
                    <div className="ps-4 text-sm font-normal">Order sent successfully</div>
                </div>
            )}
            <div className="mcdonalds-menu mt-5">
                <div className="mcdonalds-menu__item">
                    <div className="mcdonalds-menu__black-coffee" onClick={() => handleItemClick('Black Coffee')}>
                        <Image src="/products/black-coffee.jpg" alt="Black Coffee" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Black Coffee</div>
                    </div>
                    <div className="mcdonalds-menu__cappuccino mt-5" onClick={() => handleItemClick('Cappuccino')}>
                        <Image src="/products/cappuccino.jpg" alt="Cappuccino" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Cappuccino</div>
                    </div>
                    <div className="mcdonalds-menu__expresso mt-5" onClick={() => handleItemClick('Expresso')}>
                        <Image src="/products/expresso.jpg" alt="Expresso" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Expresso</div>
                    </div>
                    <div className="mcdonalds-menu__flat-white mt-5" onClick={() => handleItemClick('Flat White')}>
                        <Image src="/products/flat-white.jpg" alt="Flat White" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Flat White</div>
                    </div>
                    <div className="mcdonalds-menu__hot-chocolate mt-5" onClick={() => handleItemClick('Hot Chocolate')}>
                        <Image src="/products/hot-chocolate.jpg" alt="Hot Chocolate" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Hot Chocolate</div>
                    </div>
                    <div className="mcdonalds-menu__hot-water mt-5" onClick={() => handleItemClick('Hot Water')}>
                        <Image src="/products/hot-water.webp" alt="Hot Water" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Hot Water</div>
                    </div>
                    <div className="mcdonalds-menu__latte mt-5" onClick={() => handleItemClick('Latte')}>
                        <Image src="/products/latte.jpg" alt="Latte" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Latte</div>
                    </div>
                    <div className="mcdonalds-menu__orange-juice mt-5" onClick={() => handleItemClick('Orange Juice')}>
                        <Image src="/products/orange-juice.jpg" alt="Orange Juice" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Orange Juice</div>
                    </div>
                    <div className="mcdonalds-menu__tea mt-5" onClick={() => handleItemClick('Tea')}>
                        <Image src="/products/tea.jpg" alt="Tea" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Tea</div>
                    </div>
                    <div className="mcdonalds-menu__toffee-latte mt-5" onClick={() => handleItemClick('Toffee Latte')}>
                        <Image src="/products/toffee-latte.jpg" alt="Toffee Latte" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Toffee Latte</div>
                    </div>
                    <div className="mcdonalds-menu__water mt-5" onClick={() => handleItemClick('Water')}>
                        <Image src="/products/water.jpg" alt="Water" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">Water</div>
                    </div>
                    <div className="mcdonalds-menu__white-coffee mt-5" onClick={() => handleItemClick('White Coffee')}>
                        <Image src="/products/white-coffee.jpg" alt="White Coffee" width={180} height={180}
                               className="rounded-full aspect-square object-cover"/>
                        <div className="text-black font-bold text-center font-sans text-xl">White Coffee</div>
                    </div>
                </div>
                <div className="mcdonalds-menu__comments mt-2">
                    <div className="grid w-full gap-1.5" onClick={handleTextareaClick}>
                        <Label htmlFor="message">Your message</Label>
                        <Textarea value={textareaValue} onChange={handleTextareaChange}
                                  placeholder="Type your message here..." id="message"/>
                    </div>
                </div>
                <div className="mcdonalds-menu__selected-items mt-5">
                    <h3 className="text-xl font-bold">Selected Items:</h3>
                    <div className="w-full mt-2">
                        {renderSelectedItems()}
                    </div>
                </div>
                <div className="mcdonalds-menu__order-button flex justify-center items-center mt-5">
                    <Button onClick={handleSubmit}>
                        <RocketIcon className="mr-2 h-4 w-4" />Order
                    </Button>
                </div>
            </div>
        </main>
    );
}
