"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {IProduct} from "@/types/Product";


export async function updateStock(id: number, delta: number) {
    const supabase = await createClient();

    const { error } = await supabase.rpc('update_stock', {
        p_id: id,
        delta: delta
    });

    if (error) throw new Error("Update failed");

    revalidatePath('/dashboard');
}

export async function getProducts() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

    if (error) throw new Error("Fetch failed");

    return data || [];
}

export async function createProduct(data: IProduct) {
    const supabase = await createClient();

    const { error } = await supabase.rpc('create_product', {
        p_name: data.name,
        p_price: Number(data.price),
        p_count: Number(data.count)
    });
    if (error) throw new Error("Create failed");
    revalidatePath('/dashboard');
}

export async function deleteProduct(id: number) {
    const supabase = await createClient();

    const { error } = await supabase.rpc('delete_product', { p_id: id });

    if (error) throw new Error("Delete failed");

    revalidatePath('/dashboard');
}

export async function updateProduct(data: IProduct) {
    const supabase = await createClient();

    const { error } = await supabase.rpc('update_product', {
        p_id: data.id,
        p_name: data.name,
        p_price: Number(data.price),
        p_count: Number(data.count)
    });
    if (error) throw new Error("Update failed");
    revalidatePath('/dashboard');
}