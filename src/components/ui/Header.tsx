import * as React from 'react';
import {Plus, Search, X} from "lucide-react";

type Props = {
    onSetIsModalOpen: (isOpen: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
};

export const Header = (props: Props) => {
    return (
        <header className="sticky top-0 z-30 bg-gray-100 border-b-4 border-gray-200 px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
                    Evi-<span className="text-blue-500">Pro</span>
                </h1>
                <button
                    onClick={() => props.onSetIsModalOpen(true)}
                    className="h-12 w-12 bg-blue-500 text-white rounded-md flex items-center justify-center active:scale-90 transition-transform shadow-none cursor-pointer hover:bg-blue-600"
                >
                    <Plus size={28} strokeWidth={3} />
                </button>
            </div>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Pretraži..."
                    value={props.searchQuery}
                    onChange={(e) => props.setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 bg-white border-2 border-gray-300 rounded-md font-bold focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                />
                {props.searchQuery && (
                    <button
                        onClick={() => props.setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer p-1 rounded-md active:scale-90"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                )}
            </div>
        </header>
    );
};