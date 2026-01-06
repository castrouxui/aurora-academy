import { Star, Users, PlayCircle } from "lucide-react";
// import Image from "next/image";

export function InstructorCard() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructor</h2>

            <div>
                <h3 className="text-primary text-xl font-bold underline mb-1">Dr. Angela Yu</h3>
                <p className="text-gray-500 text-sm mb-4">Developer and Lead Instructor</p>

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative">
                        {/* Placeholder for instructor image */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-300 font-bold text-2xl">AY</div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <Star size={14} fill="currentColor" className="text-yellow-500" />
                            <span>4.7 Calificación del instructor</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>1,500,203 Estudiantes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PlayCircle size={14} />
                            <span>7 Cursos</span>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    I'm Angela, I'm a developer with a passion for teaching. I'm the lead instructor at the London App Brewery, London's leading Programming Bootcamp. I've helped hundreds of thousands of students learn to code and change their lives by becoming a developer.
                </p>
            </div>
        </div>
    );
}
