'use client'

import { motion } from "motion/react"
import { Sparkles, ArrowRight } from "lucide-react"

const fadeInUp = {
    initial: { opacity: 0, y: 60},
    animate: { opacity: 1, y: 0},
    transition: { duration: 0.6 }
}

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export default function Hero() {
    return (
        <div className="overflow-hidden container mx-auto">
            <section className="relative pt-2 pb-4">
                    <div className="
                            absolute bg-gradient-to-r from-lime-500/20 to-blue-500/20 w-72 h-72
                            rounded-full blur-3xl bottom-1/4 left-1/4
                        "
                    />
                    <motion.div 
                        className="
                            text-center backdrop-blur-xl bg-white/5 border
                          border-white/10 rounded-3xl p-8 lg:p-12 space-y-12
                        "
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="
                                inline-flex items-center gap-2 bg-gradient-to-r from-lime-500/20 to-emerald-500/20 border
                                border-lime-400/30 rounded-full px-4 py-2 backdrop-blur-xl
                            "
                            variants={fadeInUp}
                        >
                            <Sparkles className="w-4 h-4 text-lime-300" />
                            <span className="text-sm text-lime-200">
                                🎉 Limited Time: 50% OFF First 3 Months
                            </span>
                            <Sparkles className="w-4 h-4 text-lime-300" />
                        </motion.div>
                        <motion.h1
                            className="
                                text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/60
                                bg-clip-text text-transparent
                            "
                            variants={fadeInUp}
                        >
                            Transform Your Business with AI Intelligence
                        </motion.h1>
                        <motion.p
                            className="
                                text-xl text-white/70
                            "
                            variants={fadeInUp}
                        >
                            Automate workflows, gain insights, and scale your operations effortlessly.
                        </motion.p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            variants={fadeInUp}
                        >
                            <button className="
                                group bg-gradient-to-r from-lime-400/90 to-emerald-400/90 hover:from-lime-400 hover:to-emerald-400
                                text-black font-semibold px-8 py-4 rounded-xl flex items-center gap-3 shadow-2xl shadow-lime-400/20
                                hover:shadow-lime-400/40 hover:scale-105 border border-lime-400/20 transition-all duration-300
                            "
                            >
                                <span className="text-lg">Start Free Trial</span>
                                <ArrowRight className="group-hover:translate-x-1 h-5 w-5" />
                            </button>
                            <button className="
                                backdrop-blur-xl bg-white/5 border border-white/20 hover:border-white/20
                                text-white font-semibold px-8 py-4 rounded-xl flex items-center hover:scale-105
                                transition-all duration-300
                            ">
                                <span className="text-lg">Watch Demo</span>
                            </button>
                        </motion.div>
                    </motion.div>
            </section>
        </div>
    )
}