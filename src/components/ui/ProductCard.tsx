import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { IProduct } from "@/types/Inventory";
import { Edit3, Minus, Plus, Tag, Trash2 } from "lucide-react";

type Props = {
    product: IProduct;
    handleUpdateStock: (id: number, isIncrement: boolean) => void;
    handleDelete: (id: number) => void;
    handleEdit: (product: IProduct) => void;
};

const lowStock = 2;
const highStock = 10;

export const ProductCard = (props: Props) => {
    const [offset, setOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const currentX = useRef(0);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleNativeTouchMove = (e: TouchEvent) => {
            if (window.innerWidth >= 768) return;

            const currentXVal = e.touches[0].clientX;
            const currentYVal = e.touches[0].clientY;
            const diffX = currentXVal - startX.current;
            const diffY = currentYVal - startY.current;

            if (Math.abs(diffX) > Math.abs(diffY) && e.cancelable) {
                e.preventDefault();
            }
        };

        const element = cardRef.current;
        if (element) {
            element.addEventListener('touchmove', handleNativeTouchMove, { passive: false });
        }

        return () => {
            if (element) {
                element.removeEventListener('touchmove', handleNativeTouchMove);
            }
        };
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.innerWidth >= 768) return;
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping || window.innerWidth >= 768) return;
        currentX.current = e.touches[0].clientX;
        const diff = currentX.current - startX.current;

        if (diff > 100) {
            setOffset(100);
        } else if (diff < -100) {
            setOffset(-100);
        } else {
            setOffset(diff);
        }
    };

    const handleTouchEnd = () => {
        if (window.innerWidth >= 768) return;
        setIsSwiping(false);

        if (offset > 45) {
            setOffset(90);
        } else if (offset < -45) {
            setOffset(-90);
        } else {
            setOffset(0);
        }
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl md:bg-transparent">

            {/*0. EDIT, DELETE BUTTONS (MOBILE)*/}
            <div className="absolute top-0 left-0 bottom-0 w-22.5 bg-red-500 flex items-center justify-center md:hidden rounded-2xl">
                <button
                    onClick={() => {
                        setOffset(0);
                        props.handleDelete(props.product.id);
                    }}
                    className="w-full h-full flex flex-col items-center justify-center text-white active:bg-red-600 transition-colors"
                >
                    <Trash2 size={24} strokeWidth={2.5} className="mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Obriši</span>
                </button>
            </div>

            <div className="absolute top-0 right-0 bottom-0 w-22.5 bg-blue-500 flex items-center justify-center md:hidden rounded-2xl">
                <button
                    onClick={() => {
                        setOffset(0);
                        props.handleEdit(props.product);
                    }}
                    className="w-full h-full flex flex-col items-center justify-center text-white active:bg-blue-600 transition-colors"
                >
                    <Edit3 size={24} strokeWidth={2.5} className="mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Izmeni</span>
                </button>
            </div>

            <div
                ref={cardRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ transform: `translateX(${offset}px)` }}
                className={`bg-white flex flex-col relative z-10 w-full rounded-xl border-2 border-gray-100 transition-transform md:transform-none! touch-pan-y ${isSwiping ? 'duration-200' : 'duration-200 ease-out'}`}
            >

                {/*1. ICON, NAME, PRICE*/}
                <div className="flex p-4 gap-4 items-start">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                        <Tag className="text-gray-300" size={32} strokeWidth={2.5} />
                    </div>

                    <div className="grow">
                        <h3 className="text-xl font-black text-gray-900 uppercase leading-tight mb-1 truncate max-w-45 md:max-w-full">
                            {props.product.name}
                        </h3>
                        <div className="text-2xl font-black text-blue-500">
                            {props.product.price?.toLocaleString()} <span className="text-xs uppercase text-gray-400">RSD</span>
                        </div>
                    </div>
                </div>

                {/*2. PLUS, MINUS, STOCK*/}
                <div className="flex items-stretch border-t-2 border-gray-100 h-20">
                    <button
                        onClick={() => props.handleUpdateStock(props.product.id, false)}
                        disabled={props.product.count <= 0}
                        className="flex-1 bg-gray-50 text-gray-900 flex items-center justify-center active:bg-gray-200 hover:bg-gray-100 hover:cursor-pointer disabled:opacity-30 border-r-2 border-gray-100 rounded-xl"
                    >
                        <Minus size={24} strokeWidth={4} />
                    </button>

                    <div className={`
    flex-[1.5] flex flex-col items-center justify-center transition-colors
    ${props.product.count < lowStock ? 'bg-red-600 text-white' :
                        props.product.count > highStock ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}
`}>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Stanje</span>
                        <span className="text-3xl font-black leading-none">{props.product.count}</span>
                    </div>

                    <button
                        onClick={() => props.handleUpdateStock(props.product.id, true)}
                        className="flex-1 bg-gray-50 text-gray-900 flex items-center justify-center active:bg-gray-200 hover:bg-gray-100 hover:cursor-pointer border-l-2 border-gray-100"
                    >
                        <Plus size={24} strokeWidth={4} />
                    </button>
                </div>

                {/*3. EDIT, DELETE BUTTONS (DESKTOP)*/}
                <div className="hidden md:flex items-stretch h-16 border-t-2 border-gray-100 overflow-hidden rounded-b-xl">
                    <button
                        onClick={() => props.handleEdit(props.product) }
                        className="flex-1 flex items-center justify-center gap-3 bg-blue-500 text-white font-black uppercase tracking-widest active:bg-blue-600 transition-colors border-r-2 hover:bg-blue-400  hover:cursor-pointer"
                    >
                        <Edit3 size={20} strokeWidth={3} />
                        <span>Izmeni</span>
                    </button>
                    <button
                        onClick={() => props.handleDelete(props.product.id)}
                        className="flex-1 flex items-center justify-center gap-3 bg-red-500 text-white font-black uppercase tracking-widest active:bg-red-600 transition-colors hover:bg-red-400  hover:cursor-pointer"
                    >
                        <Trash2 size={20} strokeWidth={3} />
                        <span>Obriši</span>
                    </button>
                </div>
            </div>
        </div>
    );
};