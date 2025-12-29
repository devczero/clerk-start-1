'use client'

import SupabaseTest from './_components/SupabaseTest'
import DashboardSidebar from './_components/DashboardSidebar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function Dashboard() {
  const { isDarkMode } = useTheme()

  const theme = {
    bg: isDarkMode ? "#000000" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#000000",
    buttonBg: isDarkMode ? "#ffffff" : "#000000",
    buttonText: isDarkMode ? "#000000" : "#ffffff",
    buttonHoverBg: isDarkMode ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
  }

  return (
    <>
      <DashboardSidebar />
      <div className="min-h-screen p-8" style={{ backgroundColor: theme.bg, color: theme.text }}>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center mt-16">
            <h1 className="text-4xl font-bold" style={{ color: theme.text }}>Dashboard</h1>
            <Link href="/dashboard/test">
              <Button
                size="lg"
                className="font-semibold px-8 py-6 text-lg transition-colors"
                style={{
                  backgroundColor: theme.buttonBg,
                  color: theme.buttonText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.buttonHoverBg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.buttonBg
                }}
              >
                TAKE A TEST
              </Button>
            </Link>
          </div>

          <SupabaseTest/>
        </div>
      </div>
    </>
  )
}