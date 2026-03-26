// @flow
import * as React from 'react';
import {ProductCard} from "@/components/ui/ProductCard";
import {IProduct} from "@/types/Product";

type Props = {
    products: Array<IProduct> | null
    handleUpdateStock: (id: number, isIncrement: boolean) => void
    handleDelete: (id: number) => void
    handleEdit: (product: IProduct) => void
};
export const ProductList = (props: Props) => {
    return (
        <main className="p-4 space-y-6">
            {props.products?.map((product) => (
                <ProductCard key={product.id} product={product} handleUpdateStock={props.handleUpdateStock}  handleDelete={props.handleDelete} handleEdit={props.handleEdit} />
            ))}
        </main>
    );
};