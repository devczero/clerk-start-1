'use client'

import { motion } from "motion/react"
import { Brain, TrendingUp, Globe } from "lucide-react"

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

const steps = [
    {
        step: "01",
        icon: <Globe className="w-8 h-8" />,
        title: "Connect Your Data",
        description: "Securely integrate your existing systems and data sources with our platform in just a few clicks",
    },
    {
        step: "02", 
        icon: <Brain className="w-8 h-8" />,
        title: "Configure AI Models",
        description: "Choose from pre-trained models or customize AI workflows tailored to your specific business needs",
    },
    {
        step: "03",
        icon: <TrendingUp className="w-8 h-8" />,
        title: "Deploy & Scale",
        description: "Launch your AI-powered solutions instantly and scale automatically as your business grows",
    }
]

export default function HowItWorks() {
    return (
        <div className="overflow-hidden container mx-auto">
            <section className="py-8">
                <div className="container mx-auto px-4">

                    <motion.div
                        className="text-center px-4"
                        initial="initial"
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                            How It Works
                        </h2>
                        <p className="max-w-2xl mx-auto text-white/70 text-md sm:text-lg lg:text-xl">
                            Transform your business in three simple steps. Our streamlined process gets you up and running in minutes.
                        </p>
                    </motion.div>
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        {steps.map((step, index, arr) => (
                        <motion.div 
                            className="group relative"
                            key={index}
                            variants={fadeInUp}
                        >
                            {index < arr.length - 1 && (
                                <motion.div
                                    className="
                                        hidden md:block absolute top-12 left-full w-full h-0.5 z-0 -translate-y-0.5
                                        bg-gradient-to-r from-lime-400/30 to-transparent
                                    "
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3}}
                                />
                            )}
                            
                            <div
                                className="
                                    relative backdrop-blur-xl bg-white/5 hover:bg-white/[0.02] border border-white/10 hover:border-lime-400/20
                                    rounded-2xl p-8 h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl
                                    group-hover:shadow-lime-400/5 space-y-4
                                "
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 border border-lime-400/30 rounded-2xl flex items-center justify-center">
                                        {step.icon}
                                    </div>
                                    <div className="text-5xl font-bold text-white/5 group-hover:text-lime-400/10 transition-colors duration-300">
                                        {step.step}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white/90">
                                        {step.title}
                                    </h2>
                                    <p className="text-white/60 text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    )
}