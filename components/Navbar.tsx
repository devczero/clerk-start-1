"use client"

import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const closeMenu = () => {
        setIsOpen(false)
    }

    return (
        <nav className="w-full flex justify-center py-2 md:py-4">
            <div className="container w-full px-4">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="text-black font-bold w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center">
                        LO
                    </div>
                    <div className="hidden md:flex text-sm text-white/80 space-x-4">
                        <Link href="/" className="hover:text-white">
                            Home
                        </Link>
                        <SignedIn>
                            <Link href="/dashboard" className="hover:text-white">
                                Dashboard
                            </Link>
                        </SignedIn>
                        <Link href="/pricing" className="hover:text-white">
                            Pricing
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="hidden md:flex">
                            <SignedIn>
                                <SignOutButton>
                                    <button className="px-4 py-2.5 hover:text-white border border-lime-800/70 rounded-xl">
                                        Sign Out
                                    </button>
                                </SignOutButton>
                            </SignedIn>

                            <SignedOut>
                                <SignInButton>
                                    <button className="px-4 py-2.5 hover:bg-white/30 bg-white/10 border border-white/20 rounded-xl">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                        <div className="md:hidden">
                            <button onClick={toggleMenu} className="text-white p-2 rounded-xl hover:bg-white/30">
                                {isOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden fixed inset-0 z-40">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeMenu}
                    />
                    <div className="fixed left-4 right-4 top-10 z-50">
                        <div className="p-6 border border-white/10 relative">
                            <button
                                onClick={closeMenu}
                                className="absolute top-2 right-2 w-12 h-12 rounded-md hover:bg-white/10 border border-white/20
                                flex items-center justify-center"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                            <div className="flex flex-col space-y-3 text-center mt-12">
                                <Link href="/" onClick={closeMenu} className="hover:bg-white/10 rounded-xl p-4">
                                    Home
                                </Link>
                                <SignedIn>
                                    <Link href="/dashboard" onClick={closeMenu} className="hover:bg-white/10 rounded-xl p-4">
                                        Dashboard
                                    </Link>
                                </SignedIn>
                                <Link href="/pricing" onClick={closeMenu} className="hover:bg-white/10 rounded-xl p-4">
                                    Pricing
                                </Link>
                                <SignedIn>
                                    <SignOutButton>
                                        <button className="px-4 py-2.5 hover:text-white border border-lime-800/70 rounded-xl">
                                            Sign Out
                                        </button>
                                    </SignOutButton>
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton>
                                        <button 
                                            className="px-4 py-2.5 hover:bg-white/30 bg-white/10 border border-white/20 rounded-xl">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}