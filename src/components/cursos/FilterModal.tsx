import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export interface FilterState {
    categories: string[];
    levels: string[];
    types?: string[];
    price: string | null;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeFilters: FilterState;
    onApply: (filters: FilterState) => void;
    categories?: string[];
}

export function FilterModal({ isOpen, onClose, activeFilters, onApply, categories = [] }: FilterModalProps) {
    const [localFilters, setLocalFilters] = useState<FilterState>(activeFilters);

    // Default categories if none provided or empty
    const displayCategories = categories.length > 0
        ? categories
        : ['Trading', 'Finanzas Personales', 'Fondos Comunes', 'IA + Inversiones', 'Cripto', 'Bonos'];

    // Reset local filters when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(activeFilters);
        }
    }, [isOpen, activeFilters]);

    if (!isOpen) return null;

    const toggleCategory = (category: string) => {
        setLocalFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const toggleLevel = (level: string) => {
        setLocalFilters(prev => ({
            ...prev,
            levels: prev.levels.includes(level)
                ? prev.levels.filter(l => l !== level)
                : [...prev.levels, level]
        }));
    };

    const setPrice = (price: string) => {
        setLocalFilters(prev => ({ ...prev, price }));
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#1F2937] border border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">Filtros</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Categoría</h4>
                        <div className="space-y-2">
                            {displayCategories.map(c => (
                                <label key={c} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer appearance-none w-5 h-5 border border-gray-500 rounded bg-transparent checked:bg-primary checked:border-primary transition-colors"
                                            checked={localFilters.categories.includes(c)}
                                            onChange={() => toggleCategory(c)}
                                        />
                                        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 12 10" fill="none">
                                            <path d="M1 5L4.5 8.5L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="group-hover:text-white transition-colors">{c}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Level */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Nivel</h4>
                        <div className="space-y-2">
                            {['Principiante', 'Intermedio', 'Avanzado'].map(l => (
                                <label key={l} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer appearance-none w-5 h-5 border border-gray-500 rounded bg-transparent checked:bg-primary checked:border-primary transition-colors"
                                            checked={localFilters.levels.includes(l)}
                                            onChange={() => toggleLevel(l)}
                                        />
                                        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 12 10" fill="none">
                                            <path d="M1 5L4.5 8.5L11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="group-hover:text-white transition-colors">{l}</span>
                                </label>
                            ))}
                        </div>
                    </div>



                    {/* Price */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Precio</h4>
                        <div className="space-y-2">
                            {['Gratis', 'De Pago'].map(p => (
                                <label key={p} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="radio"
                                            name="price"
                                            className="peer appearance-none w-5 h-5 border border-gray-500 rounded-full bg-transparent checked:border-primary checked:before:bg-primary checked:before:w-2.5 checked:before:h-2.5 checked:before:rounded-full checked:before:absolute checked:before:left-1/2 checked:before:top-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 transition-colors"
                                            checked={localFilters.price === p}
                                            onChange={() => setPrice(p)}
                                        />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 bg-[#1F2937] flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent border-gray-600 text-white hover:bg-white/5" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button className="flex-1" onClick={handleApply}>
                        Aplicar Filtros
                    </Button>
                </div>
            </div>
        </div>
    );
}
