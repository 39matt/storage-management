// @flow
import * as React from 'react';
import {IProduct} from "@/types/Inventory";
import {Edit3, Minus, Plus, Tag, Trash2} from "lucide-react";

type Props = {
    product: IProduct
    handleUpdateStock: (id: number, isIncrement: boolean) => void
};
export const ProductCard = (props: Props) => {
    return (
        <div>
            <div
                key={props.product.id}
                className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden flex flex-col active:border-blue-500 transition-colors"
            >
                {/* TOP SECTION: INFO & UTILITIES */}
                <div className="flex p-4 gap-4 items-start">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                        <Tag className="text-gray-300" size={32} strokeWidth={2.5} />
                    </div>

                    <div className="grow">
                        <h3 className="text-xl font-black text-gray-900 uppercase leading-tight mb-1 truncate max-w-45">
                            {props.product.name}
                        </h3>
                        <div className="text-2xl font-black text-blue-500">
                            {props.product.price?.toLocaleString()} <span className="text-xs uppercase text-gray-400">RSD</span>
                        </div>
                    </div>

                    {/* SMALL UTILITY BUTTONS (TOP RIGHT) */}
                    <div className="flex flex-col gap-2">
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-md active:bg-blue-500 active:text-white transition-colors">
                            <Edit3 size={18} strokeWidth={2.5} />
                        </button>
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-md active:bg-red-500 active:text-white transition-colors">
                            <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* BOTTOM SECTION: MASSIVE THUMB-TARGETS FOR STOCK */}
                <div className="flex items-stretch border-t-2 border-gray-100 h-20">
                    {/* MINUS BUTTON */}
                    <button
                        onClick={() => props.handleUpdateStock(props.product.id, false)}
                        disabled={props.product.count <= 0}
                        className="flex-1 bg-gray-50 text-gray-900 flex items-center justify-center active:bg-gray-200 disabled:opacity-30 border-r-2 border-gray-100"
                    >
                        <Minus size={24} strokeWidth={4} />
                    </button>

                    {/* CURRENT STOCK (CENTER DISPLAY) */}
                    <div className={`
                            flex-[1.5] flex flex-col items-center justify-center transition-colors
                            ${props.product.count > 10 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}
                            `}>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Stanje</span>
                        <span className="text-3xl font-black leading-none">{props.product.count}</span>
                    </div>

                    {/* PLUS BUTTON */}
                    <button
                        onClick={() => props.handleUpdateStock(props.product.id, true)}
                        className="flex-1 bg-gray-50 text-gray-900 flex items-center justify-center active:bg-gray-200 border-l-2 border-gray-100"
                    >
                        <Plus size={24} strokeWidth={4} />
                    </button>
                </div>
            </div>
        </div>
    );
};