"use client";

import {SubmitHandler, useForm} from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import {INewProductInput} from "@/types/Forms";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: SubmitHandler<INewProductInput>;
}

export default function NewProductModal(props: Props) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<INewProductInput>();

    if (!props.isOpen) return null;

    const handleInternalSubmit = async (data: INewProductInput) => {
        await props.onSubmit(data);
        reset();
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
            <header className="p-6 border-b-4 border-gray-100 flex justify-between items-center">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                    Novi <span className="text-blue-500">Proizvod</span>
                </h2>
                <button onClick={props.onClose} className="p-2 bg-gray-100 rounded-md active:scale-90 transition-transform">
                    <X size={32} strokeWidth={3} />
                </button>
            </header>
            <form onSubmit={handleSubmit(handleInternalSubmit)} className="p-6 flex-1 flex flex-col gap-6">

                {/* NAZIV INPUT */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-800">Naziv Artikla</label>
                    <input
                        {...register("name", { required: "Naziv je obavezan" })}
                        className={`w-full h-16 px-4 bg-white border-4 rounded-lg text-xl font-bold outline-none transition-all
                ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-900 focus:border-blue-500'}
            `}
                    />
                    {errors.name && <p className="text-red-500 font-black uppercase text-[10px] tracking-tighter">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* CENA INPUT */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-800">Cena (RSD)</label>
                        <input
                            type="number"
                            {...register("price", { required: true, min: 0 })}
                            className={`w-full h-16 px-4 bg-white border-4 rounded-lg text-xl font-bold outline-none
                    ${errors.price ? 'border-red-500' : 'border-gray-900 focus:border-blue-500'}
                `}
                        />
                    </div>

                    {/* STANJE INPUT */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-800">Stanje</label>
                        <input
                            type="number"
                            {...register("count", { required: true, min: 0 })}
                            className={`w-full h-16 px-4 bg-white border-4 rounded-lg text-xl font-bold outline-none
                    ${errors.count ? 'border-red-500' : 'border-gray-900 focus:border-blue-500'}
                `}
                        />
                    </div>
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-auto w-full h-20 bg-blue-500 text-white font-black text-2xl uppercase rounded-xl active:scale-95 disabled:bg-gray-300 flex items-center justify-center"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sačuvaj Proizvod'}
                </button>
            </form>        </div>
    );
}