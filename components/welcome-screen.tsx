"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Stars, Moon, Sun } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                <Stars className="w-10 h-10 text-white" />
              </div>
              <Moon className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2" />
              <Sun className="w-5 h-5 text-orange-300 absolute -bottom-1 -left-2" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">AstroPlanner</h1>

          <p className="text-purple-100 text-lg mb-8 leading-relaxed">
            Plan your life with the stars. Add your tasks, see your personal lucky and challenging days.
          </p>

          <Button
            onClick={onGetStarted}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Get Started
          </Button>

          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
