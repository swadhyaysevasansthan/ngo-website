import React from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BookOpen,
    Brush,
    FileText,
    ChevronRight,
} from "lucide-react";

const cardStyles = {
    painting: {
        icon: Brush,
        gradient: "from-orange-500 via-orange-500 to-amber-500",
        border: "border-orange-200",
        lightBg: "bg-orange-50",
        badge: "bg-orange-100 text-orange-700",
    },

    quiz: {
        icon: BookOpen,
        gradient: "from-emerald-500 via-emerald-500 to-teal-600",
        border: "border-emerald-200",
        lightBg: "bg-emerald-50",
        badge: "bg-emerald-100 text-emerald-700",
    },
};

export default function CompetitionRulesSection({
    competitionRules,
    onOpen,
}) {
    const competitions = Object.values(competitionRules);

    return (
        <section className="border-t border-gray-100 py-20">   
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: .5 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
                        <FileText className="w-4 h-4" />
                        Official Guidelines
                    </div>
                    <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-gray-900">
                        Rules & Regulations
                    </h2>
                    <p className="mt-4 max-w-3xl mx-auto text-gray-600 leading-relaxed">
                        Please read the official rules and regulations carefully before
                        participating. Click on a competition below to view all rules,
                        eligibility, evaluation criteria, awards and important instructions.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {competitions.map((competition, index) => {
                        const style = cardStyles[competition.id];
                        const Icon = style.icon;
                        return (
                            <motion.div
                                key={competition.id}
                                initial={{
                                    opacity: 0,
                                    y: 40,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * .1,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className={`overflow-hidden rounded-3xl border-2 ${style.border} bg-white shadow-lg hover:shadow-2xl transition-all duration-300`}
                            >
                                <button
                                    type="button"
                                    onClick={() => onOpen(competition)}
                                    className="block w-full text-left p-0 m-0 bg-transparent"
                                >

                                    {/* Header */}
                                    <div
                                        className={`w-full bg-gradient-to-r ${style.gradient} px-8 py-8 text-white`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                                    <Icon className="w-8 h-8" />
                                                </div>
                                                <p className="mt-6 uppercase tracking-[0.18em] text-xs font-semibold opacity-90">
                                                    Rules & Regulations
                                                </p>
                                                <h3 className="mt-2 text-2xl font-extrabold leading-tight">
                                                    {competition.title}
                                                </h3>
                                            </div>
                                            <span
                                                className={`rounded-full ${style.badge} px-4 py-2 text-sm font-bold whitespace-nowrap`}
                                            >
                                                {competition.sections.length} Sections
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className={`${style.lightBg} px-8 py-7`}>
                                        <p className="text-gray-700 leading-relaxed">
                                            {competition.id === "painting"
                                                ? "Read the complete artwork specifications, eligibility, judging criteria, participation process, awards, school responsibilities and all official guidelines for the National Environmental Painting Competition."
                                                : "Read the complete eligibility, competition format, registration process, evaluation criteria, awards, school responsibilities and official guidelines for the National Environment Quiz Competition."}
                                        </p>
                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="flex items-center gap-2 font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                Read Complete Rules
                                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                            </div>
                                            <div
                                                className={`w-12 h-12 rounded-full bg-gradient-to-r ${style.gradient} flex items-center justify-center text-white shadow-lg`}
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 px-8 py-6"
                >
                    <h3 className="font-bold text-emerald-800 text-lg mb-2">
                        Before You Register
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        Participants and schools are strongly advised to read the complete
                        Rules & Regulations before registration. Participation in the
                        competition constitutes acceptance of all rules, eligibility
                        conditions, evaluation criteria and decisions of the Swadhyay Seva
                        Foundation.
                    </p>
                </motion.div>
                </div>
        </section>
    );
}