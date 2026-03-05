"use client";

import {createClient} from "@/utils/supabase/client";
import {useCallback, useEffect, useMemo, useState} from "react";
import {SubmitHandler} from "react-hook-form";
import {Header} from "@/components/ui/Header";
import {ProductList} from "@/components/ui/ProductList";
import {IProduct} from "@/types/Inventory";
import {INewProductInput} from "@/types/Forms";
import ProductModal from "@/components/inventory/ProductModal";
import toast, {Toaster} from "react-hot-toast";


export default function DashboardPage() {
    const [products, setProducts] = useState<IProduct[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    const handleNewProductModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProductModal = (product: IProduct) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const onFormSubmit: SubmitHandler<INewProductInput> = async (data) => {
        if (editingProduct) {
            const { error } = await supabase.rpc('update_product', {
                p_id: editingProduct.id,
                p_name: data.name,
                p_price: Number(data.price),
                p_count: Number(data.count)
            });

            if (!error) {
                await fetchProducts();
                setIsModalOpen(false);
                setEditingProduct(null);
            } else {
                console.error("Supabase Update Error:", error.message);
            }
        } else {
            const { error } = await supabase.rpc('create_product', {
                p_name: data.name,
                p_price: Number(data.price),
                p_count: Number(data.count)
            });

            if (!error) {
                await fetchProducts();
                setIsModalOpen(false);
            } else {
                console.error("Supabase Create Error:", error.message);
            }
        }
    };

    const handleUpdateStock = async (id: number, isIncrement: boolean) => {
        const product = products?.find(p => p.id === id);

        if (!isIncrement && product && product.count <= 0) {
            toast.error("Stanje ne može ići ispod nule!", {
                style: {
                    border: '4px solid #111827',
                    padding: '16px',
                    color: '#111827',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 0px #111827'
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
            return;
        }

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
            toast.error("Greška pri komunikaciji sa serverom!");
        }
    };
    const handleDelete = async (id: number) => {
        setProducts(prev => prev?.filter(p => p.id !== id) || null);

        try {
            const { error } = await supabase.rpc('delete_product', { row_id: id });

            if (error) {
                await fetchProducts();
            }
        } catch {
            await fetchProducts();
        }
    }


    const filteredProducts = useMemo(() => {
        if (!products) return null;
        if (!searchQuery) return products;

        const lowerCaseQuery = searchQuery.toLowerCase();

        return products.filter(product =>
            product.name.toLowerCase().includes(lowerCaseQuery)
        );
    }, [products, searchQuery]);

    return (
        <div className="min-h-screen bg-white font-['Outfit',sans-serif] pb-32">
            <Toaster position="top-center" />
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                onSubmit={onFormSubmit}
                initialData={editingProduct}
            />
            {/* 1. STICKY MOBILE HEADER */}
            <Header onSetIsModalOpen={handleNewProductModal} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* 2. SCROLLABLE CONTENT AREA */}
            {filteredProducts && filteredProducts.length > 0 ? (
                <ProductList
                    products={filteredProducts}
                    handleUpdateStock={handleUpdateStock}
                    handleDelete={handleDelete}
                    handleEdit={handleEditProductModal}
                />
            ) : (
                <div className="p-10 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                        {searchQuery ? 'Nema rezultata pretrage' : 'Nema proizvoda'}
                    </p>
                </div>
            )}
        </div>
    );
}