"use client"

import { useState } from "react"
import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()

  const theme = {
    menuButtonBg: isDarkMode ? "#121212" : "#f8f9fa",
    menuButtonBorder: isDarkMode ? "#1A1A1A" : "#e0e0e0",
    menuButtonText: isDarkMode ? "#ffffff" : "#000000",
    menuButtonHoverBg: isDarkMode ? "#242424" : "#e5e7eb",
    sidebarBg: isDarkMode ? "#121212" : "#f8f9fa",
    sidebarBorder: isDarkMode ? "#1A1A1A" : "#e0e0e0",
    dividerBorder: isDarkMode ? "#1A1A1A" : "#d1d5db",
    linkText: isDarkMode ? "#ffffff" : "#000000",
    linkHoverBg: isDarkMode ? "#242424" : "#e5e7eb",
    buttonBg: isDarkMode ? "#0A0A0A" : "#ffffff",
    buttonBorder: isDarkMode ? "#1A1A1A" : "#d1d5db",
    buttonHoverBg: isDarkMode ? "#242424" : "#f3f4f6",
  }

  return (
    <>
      {/* Menu Icon - Fixed in top left corner */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-40 border-2 p-3 rounded-lg transition-colors"
        style={{
          backgroundColor: theme.menuButtonBg,
          borderColor: theme.menuButtonBorder,
          color: theme.menuButtonText
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.menuButtonHoverBg
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.menuButtonBg
        }}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 border-r-2 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: theme.sidebarBg,
          borderColor: theme.sidebarBorder
        }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="self-end mb-8 border-2 p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: theme.buttonBg,
              borderColor: theme.buttonBorder,
              color: theme.linkText
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.buttonHoverBg
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.buttonBg
            }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="text-black font-bold w-12 h-12 rounded-full bg-lime-400 flex items-center justify-center text-lg">
              LO
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4 flex-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-lg px-4 py-3 rounded-lg transition-colors"
              style={{ color: theme.linkText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.linkHoverBg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              Dashboard
            </Link>

            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="text-lg px-4 py-3 rounded-lg transition-colors"
              style={{ color: theme.linkText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.linkHoverBg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              Manage Subscription
            </Link>

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-lg px-4 py-3 rounded-lg transition-colors"
              style={{ color: theme.linkText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.linkHoverBg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              Landing Page
            </Link>

            <div className="border-t-2 my-4" style={{ borderColor: theme.dividerBorder }} />

            <Link
              href="/dashboard/test"
              onClick={() => setIsOpen(false)}
              className="text-lg px-4 py-3 rounded-lg transition-colors"
              style={{ color: theme.linkText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.linkHoverBg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              Take Test
            </Link>
          </nav>

          {/* Theme Toggle & Sign Out */}
          <div className="mt-auto pt-6 border-t-2 space-y-3" style={{ borderColor: theme.dividerBorder }}>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="w-full text-lg py-6 flex items-center justify-center gap-2 transition-colors"
              style={{
                backgroundColor: theme.buttonBg,
                borderColor: theme.buttonBorder,
                color: theme.linkText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.buttonHoverBg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.buttonBg
              }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>

            <SignOutButton>
              <Button
                variant="outline"
                className="w-full text-lg py-6 transition-colors"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.linkText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.buttonHoverBg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.buttonBg
                }}
              >
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </>
  )
}
