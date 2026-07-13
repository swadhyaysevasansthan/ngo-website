import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    CheckCircle2,
    BookOpen,
    Brush,
} from "lucide-react";

const iconMap = {
    painting: Brush,
    quiz: BookOpen,
};

const colorMap = {
    painting: {
        gradient: "from-orange-500 to-amber-500",
        badge: "bg-orange-100 text-orange-700",
        border: "border-orange-200",
        icon: "text-orange-600",
    },
    quiz: {
        gradient: "from-emerald-500 to-teal-600",
        badge: "bg-emerald-100 text-emerald-700",
        border: "border-emerald-200",
        icon: "text-emerald-600",
    },
};

export default function CompetitionRulesModal({open, onClose, competition,}) {
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!competition) return null;

    const colors = colorMap[competition.id];
    const Icon = iconMap[competition.id];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 40,
                            scale: 0.96,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 30,
                            scale: 0.96,
                        }}
                        transition={{
                            duration: .25,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-5xl max-h-[92vh]"
                    >
                        {/* HEADER */}
                        <div
                            className={`bg-gradient-to-r ${colors.gradient} text-white px-8 py-6`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="bg-white/20 rounded-2xl p-3">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="uppercase tracking-[0.2em] text-xs opacity-90 font-semibold">
                                            Rules & Regulations
                                        </p>
                                        <h2 className="text-3xl font-bold mt-1">
                                            {competition.title}
                                        </h2>
                                        <p className="opacity-90 mt-2">
                                            Please read all rules carefully before participating.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="rounded-full p-2 hover:bg-white/20 transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="overflow-y-auto max-h-[72vh] px-8 py-8">
                            <div className="space-y-8">
                                {competition.sections.map((section, index) => (
                                    <motion.div
                                        key={section.title}
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay: index * 0.03,
                                        }}
                                        className={`border rounded-2xl ${colors.border} overflow-hidden`}
                                    >
                                        <div
                                            className={`bg-gray-50 px-6 py-4 border-b ${colors.border}`}
                                        >
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {section.title}
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {section.description && (
                                                <p className="text-gray-600 leading-relaxed">
                                                    {section.description}
                                                </p>
                                            )}
                                            {section.points.map((point, i) => (
                                                <div
                                                    key={i}
                                                    className="flex gap-3 items-start"
                                                >
                                                    <CheckCircle2
                                                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`}
                                                    />
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {point}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-10 border-t pt-6">
                                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Contact
                                    </h4>
                                    <p className="text-gray-600">
                                        Swadhyay Seva Foundation
                                    </p>
                                    <p className="text-gray-600">
                                        🌐 www.swadhyayseva.org
                                    </p>
                                    <p className="text-gray-600">
                                        ✉ swadhyaysevafoundation@gmail.com
                                    </p>
                                    <p className="text-gray-600">
                                        ☎ 9599224323 / 9837042298
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}