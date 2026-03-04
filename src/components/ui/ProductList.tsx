// @flow
import * as React from 'react';
import {ProductCard} from "@/components/ui/ProductCard";
import {IProduct} from "@/types/Inventory";

type Props = {
    products: Array<IProduct> | null
    handleUpdateStock: (id: number, isIncrement: boolean) => void

};
export const ProductList = (props: Props) => {
    return (
        <main className="p-4 space-y-6">
            {props.products?.map((product, index) => (
                <ProductCard key={index} product={product} handleUpdateStock={props.handleUpdateStock} />
            ))}
        </main>
    );
};