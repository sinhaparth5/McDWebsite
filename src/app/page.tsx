"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RocketIcon, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { sendOrderEmails } from "@/lib/send-email";

export default function Home() {
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
    const [textareaValue, setTextareaValue] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [showSelectedItem, setShowSelectedItem] = useState<boolean>(false);
    const [toastTimeout, setToastTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [selectedItemTimeout, setSelectedItemTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
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
        }, 3000);
        setSelectedItemTimeout(timeout);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.target.value);
    };

    const handleTextareaClick = () => {
        if (textareaValue === 'N/A' || textareaValue === '') {
            setTextareaValue('');
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedItems).length === 0) {
            alert('Please select at least one item before ordering.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Use the server action to send emails
            const result = await sendOrderEmails({
                items: selectedItems,
                comment: textareaValue
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to send order');
            }

            // Show the toast notification
            setShowToast(true);
            if (toastTimeout) clearTimeout(toastTimeout);
            
            // Clear the selected items and comments after successful submission
            setSelectedItems({});
            setTextareaValue('');
            
            const timeout = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            setToastTimeout(timeout);
        } catch (error) {
            console.error('Error sending order:', error);
            alert('Failed to send order. Please try again.');
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
        if (Object.keys(selectedItems).length === 1 && selectedItems[itemName] === 1) {
            setShowSelectedItem(false);
        }
    };

    const renderSelectedItems = () => {
        return Object.entries(selectedItems).map(([item, count]) => (
            <div key={item} className="flex justify-between w-full items-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg mb-3 border border-yellow-200 shadow-sm transition-all hover:shadow">
                <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full mr-3 shadow-inner" style={{backgroundColor: '#bf2a20'}}>
                        <span className="text-sm font-bold" style={{color: '#eebe46'}}>{count}x</span>
                    </div>
                    <span className="font-semibold text-gray-800">{item}</span>
                </div>
                <button
                    className="ml-2 px-3 py-1 rounded-md text-sm font-bold transition-all hover:bg-red-100"
                    style={{color: '#bf2a20'}}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item);
                    }}
                >
                    Remove
                </button>
            </div>
        ));
    };

    // Calculate total items
    const totalItems = Object.values(selectedItems).reduce((sum, count) => sum + count, 0);

    return (
        <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-white">
            {/* Toast Notifications */}
            <div className="fixed top-20 right-4 z-50">
                {showSelectedItem && (
                    <div 
                        className="flex items-center p-4 mb-3 text-black border border-yellow-300 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 animate-fadeIn"
                        role="alert"
                        style={{backgroundColor: 'rgba(238, 190, 70, 0.9)', boxShadow: '0 4px 12px rgba(238, 190, 70, 0.5)'}}
                    >
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-700 bg-yellow-100 rounded-lg border border-yellow-300 shadow-inner">
                            <Coffee className="w-5 h-5" style={{color: '#bf2a20'}} />
                        </div>
                        <div className="ml-3 text-sm font-bold">Item Added to Cart</div>
                    </div>
                )}
                
                {showToast && (
                    <div 
                        className="flex items-center p-4 text-black border border-green-400 bg-gradient-to-r from-green-300 to-green-400 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 animate-fadeIn"
                        role="alert"
                        style={{boxShadow: '0 4px 12px rgba(74, 222, 128, 0.5)'}}
                    >
                        <svg className="w-5 h-5 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="ml-3 text-sm font-bold">Order sent successfully!</div>
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4 py-10 max-w-6xl">
                {/* Menu Title */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-yellow-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <h1 className="px-6 py-3 text-4xl font-bold text-center mb-8 bg-white rounded-full shadow-md" style={{color: '#bf2a20'}}>
                            Our Beverage Menu
                            <div className="h-1 w-24 mx-auto mt-2 rounded-full" style={{backgroundColor: '#eebe46'}}></div>
                        </h1>
                    </div>
                </div>
                
                {/* Menu Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* Black Coffee */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Black Coffee')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/black-coffee.jpg" 
                                alt="Black Coffee" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Black Coffee</h3>
                        </div>
                    </div>

                    {/* Cappuccino */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Cappuccino')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/cappuccino.jpg" 
                                alt="Cappuccino" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Cappuccino</h3>
                        </div>
                    </div>

                    {/* Espresso */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Espresso')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/expresso.jpg" 
                                alt="Espresso" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Espresso</h3>
                        </div>
                    </div>

                    {/* Flat White */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Flat White')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/flat-white.jpg" 
                                alt="Flat White" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Flat White</h3>
                        </div>
                    </div>

                    {/* Hot Chocolate */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Hot Chocolate')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/hot-chocolate.jpg" 
                                alt="Hot Chocolate" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Hot Chocolate</h3>
                        </div>
                    </div>

                    {/* Hot Water */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Hot Water')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/hot-water.webp" 
                                alt="Hot Water" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Hot Water</h3>
                        </div>
                    </div>

                    {/* Latte */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Latte')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/latte.jpg" 
                                alt="Latte" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Latte</h3>
                        </div>
                    </div>

                    {/* Orange Juice */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Orange Juice')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/orange-juice.jpg" 
                                alt="Orange Juice" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Orange Juice</h3>
                        </div>
                    </div>

                    {/* Tea */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Tea')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/tea.jpg" 
                                alt="Tea" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Tea</h3>
                        </div>
                    </div>

                    {/* Toffee Latte */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Toffee Latte')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/toffee-latte.jpg" 
                                alt="Toffee Latte" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Toffee Latte</h3>
                        </div>
                    </div>

                    {/* Water */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('Water')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/water.jpg" 
                                alt="Water" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>Water</h3>
                        </div>
                    </div>

                    {/* White Coffee */}
                    <div 
                        className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleItemClick('White Coffee')}
                        style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}
                    >
                        <div className="relative h-40 overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                            <Image 
                                src="/products/white-coffee.jpg" 
                                alt="White Coffee" 
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                <RocketIcon className="w-5 h-5" style={{color: '#bf2a20'}} />
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600" style={{backgroundColor: '#bf2a20'}}>
                            <h3 className="text-lg font-bold text-center" style={{color: '#eebe46'}}>White Coffee</h3>
                        </div>
                    </div>
                </div>
                
                {/* Order Section */}
                <div className="mt-16 relative">
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg" 
                         style={{border: '4px solid #eebe46', backgroundColor: '#bf2a20'}}>
                        <RocketIcon className="h-10 w-10" style={{color: '#eebe46'}} />
                    </div>
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100"
                         style={{boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'}}>
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold mb-2" style={{color: '#bf2a20'}}>Your Order</h2>
                            <div className="h-1 w-20 mx-auto rounded-full" style={{backgroundColor: '#eebe46'}}></div>
                        </div>
                        
                        {/* Selected Items */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Selected Items</h3>
                                <span className="px-3 py-1 rounded-full text-sm font-bold" 
                                      style={{backgroundColor: totalItems > 0 ? '#eebe46' : '#e5e7eb', color: totalItems > 0 ? '#1f2937' : '#9ca3af'}}>
                                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-inner">
                                {Object.keys(selectedItems).length > 0 ? (
                                    renderSelectedItems()
                                ) : (
                                    <div className="text-center py-6">
                                        <Coffee className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-gray-400 italic">No items selected yet. Click on the beverages above to add them to your order.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Comments */}
                        <div className="mb-8">
                            <Label htmlFor="message" className="text-lg font-semibold text-gray-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" style={{color: '#bf2a20'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                Special Instructions
                            </Label>
                            <Textarea 
                                value={textareaValue} 
                                onChange={handleTextareaChange}
                                onClick={handleTextareaClick}
                                placeholder="Add any special instructions here..." 
                                id="message"
                                className="mt-2 border-2 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 rounded-xl shadow-sm"
                                style={{borderColor: '#eebe46', minHeight: '100px'}}
                            />
                        </div>
                        
                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting || Object.keys(selectedItems).length === 0}
                                className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{backgroundColor: '#bf2a20', color: '#eebe46', boxShadow: '0 10px 15px -3px rgba(191, 42, 32, 0.3), 0 4px 6px -2px rgba(191, 42, 32, 0.2)'}}
                            >
                                <RocketIcon className="mr-3 h-6 w-6" />
                                {isSubmitting ? 'Sending Order...' : 'Place Order'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="w-full bg-gradient-to-r from-red-700 to-red-600 text-center mt-16 py-6 relative shadow-inner" style={{backgroundColor: '#bf2a20'}}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
                <div className="absolute inset-0 bg-[url('/arches-pattern.png')] opacity-5"></div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <span className="text-3xl font-bold mr-2" style={{color: '#eebe46'}}>M</span>
                            <span className="text-yellow-300">McDonald's</span>
                        </div>
                        <p style={{color: '#eebe46'}}>© {new Date().getFullYear()} McDonald's Beverage Ordering System</p>
                        <div className="flex items-center mt-4 md:mt-0">
                            <span className="text-yellow-300 text-sm">I'm lovin' it</span>
                            <span className="text-xl ml-2" style={{color: '#eebe46'}}>™</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}