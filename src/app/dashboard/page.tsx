"use client";

import {createClient} from "@/utils/supabase/client";
import {useCallback, useEffect, useState} from "react";
import {SubmitHandler} from "react-hook-form";
import NewProductModal from "@/components/inventory/NewProductModal";
import {Header} from "@/components/ui/Header";
import {ProductList} from "@/components/ui/ProductList";
import {IProduct} from "@/types/Inventory";
import {INewProductInput} from "@/types/Forms";


export default function DashboardPage() {
    const [products, setProducts] = useState<IProduct[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const supabase = createClient();
    const fetchProducts = useCallback(async () => {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("Error fetching products:", error.message);
            return;
        }

        if (data) {
            setProducts(data);
        }
    }, [supabase]);

    useEffect(() => {
        const initFetch = async () => {
            await fetchProducts();
        };

        initFetch();
    }, [fetchProducts]);

    const onFormSubmit: SubmitHandler<INewProductInput> = async (data) => {
        const { error } = await supabase.rpc('create_product', {
            p_name: data.name,
            p_price: Number(data.price),
            p_count: Number(data.count)
        });

        if (!error) {
            await fetchProducts();
            setIsModalOpen(false);
        } else {
            console.error("Supabase Error:", error.message);
        }
    };

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
        <div className="min-h-screen bg-white font-['Outfit',sans-serif] pb-32">

            <NewProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={onFormSubmit}
            />
            {/* 1. STICKY MOBILE HEADER */}
            <Header onSetIsModalOpen={setIsModalOpen}/>

            {/* 2. SCROLLABLE CONTENT AREA */}
            {products && products.length > 0 ? (
                <ProductList products={products} handleUpdateStock={handleUpdateStock}/>
            ) : (
                <div className="p-10 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nema proizvoda</p>
                </div>
            )}
        </div>
    );
}