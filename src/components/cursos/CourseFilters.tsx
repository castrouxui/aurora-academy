export function CourseFilters() {
    return (
        <div className="space-y-8 bg-card p-6 rounded-2xl border border-white/5">
            <div>
                <h3 className="text-white font-bold mb-4">Categoría</h3>
                <div className="space-y-2">
                    {['Desarrollo Web', 'Data Science', 'Finanzas', 'Marketing', 'Diseño'].map(c => (
                        <label key={c} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-600 bg-transparent text-primary focus:ring-primary" />
                            {c}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-white font-bold mb-4">Nivel</h3>
                <div className="space-y-2">
                    {['Principiante', 'Intermedio', 'Experto'].map(l => (
                        <label key={l} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-600 bg-transparent text-primary focus:ring-primary" />
                            {l}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-white font-bold mb-4">Precio</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                        <input type="radio" name="price" className="border-gray-600 bg-transparent text-primary" />
                        Gratis
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                        <input type="radio" name="price" className="border-gray-600 bg-transparent text-primary" />
                        De Pago
                    </label>
                </div>
            </div>
        </div>
    );
}
