"use client";

import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Plus, Edit3, Trash2, Package, Search, Tag, Minus} from "lucide-react";

interface IProduct {
    id: number;
    name: string;
    price: number;
    count: number;
}

export default function ProductList() {
    const [products, setProducts] = useState<IProduct[] | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchProducts = async () => {
            const {data} = await supabase.from("products").select("*");
            setProducts(data);
        };
        fetchProducts();
    }, [supabase]);

    const handleUpdateStock = async (id: number, isIncrement: boolean) => {
        setProducts(prev =>
            prev?.map(p => p.id === id
                ? { ...p, count: p.count + (isIncrement ? 1 : -1) }
                : p
            ) || null
        );
        const { error } = await supabase.rpc('update_stock', {
            row_id: id,
            delta: isIncrement ? 1 : -1
        });

        if (error) {
            console.error("Failed to update stock:", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-white font-['Outfit',_sans-serif] pb-32">
            {/* 1. STICKY MOBILE HEADER */}
            <header className="sticky top-0 z-30 bg-gray-100 border-b-4 border-gray-200 px-4 py-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
                        Evi-<span className="text-blue-500">Pro</span>
                    </h1>
                    <button className="h-12 w-12 bg-blue-500 text-white rounded-md flex items-center justify-center active:scale-90 transition-transform">
                        <Plus size={28} strokeWidth={3} />
                    </button>
                </div>

                {/* LARGE TOUCH-TARGET SEARCH */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Pretraži..."
                        className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-300 rounded-md font-bold focus:border-blue-500 outline-none"
                    />
                </div>
            </header>

            {/* 2. SCROLLABLE CONTENT AREA */}
            <main className="p-4 space-y-6">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden flex flex-col active:border-blue-500 transition-colors"
                    >
                        {/* TOP SECTION: INFO & UTILITIES */}
                        <div className="flex p-4 gap-4 items-start">
                            <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                                <Tag className="text-gray-300" size={32} strokeWidth={2.5} />
                            </div>

                            <div className="grow">
                                <h3 className="text-xl font-black text-gray-900 uppercase leading-tight mb-1 truncate max-w-[180px]">
                                    {product.name}
                                </h3>
                                <div className="text-2xl font-black text-blue-500">
                                    {product.price?.toLocaleString()} <span className="text-xs uppercase text-gray-400">RSD</span>
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
                                onClick={() => handleUpdateStock(product.id, false)}
                                disabled={product.count <= 0}
                                className="flex-1 bg-gray-50 text-gray-900 flex items-center justify-center active:bg-gray-200 disabled:opacity-30 border-r-2 border-gray-100"
                            >
                                <Minus size={24} strokeWidth={4} />
                            </button>

                            {/* CURRENT STOCK (CENTER DISPLAY) */}
                            <div className={`
                flex-[1.5] flex flex-col items-center justify-center transition-colors
                ${product.count > 10 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}
              `}>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Stanje</span>
                                <span className="text-3xl font-black leading-none">{product.count}</span>
                            </div>

                            {/* PLUS BUTTON */}
                            <button
                                onClick={() => handleUpdateStock(product.id, true)}
                                className="flex-1 bg-gray-50 text-gray-900 flex items-center justify-center active:bg-gray-200 border-l-2 border-gray-100"
                            >
                                <Plus size={24} strokeWidth={4} />
                            </button>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}