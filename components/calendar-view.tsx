"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, User, CalendarIcon, CheckSquare, LogOut } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns"
import type { BirthData, Task } from "@/app/page"
import { DayDetailModal } from "@/components/day-detail-modal"

interface CalendarViewProps {
  birthData: BirthData
  tasks: Task[]
  onAddTask: (task: Omit<Task, "id">) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onNavigateToTasks: () => void
  onNavigateToProfile: () => void
  onLogout: () => void
}

export function CalendarView({
  birthData,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onNavigateToTasks,
  onNavigateToProfile,
  onLogout,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Extended astrological logic for the entire month
  const getDayRecommendations = (date: Date) => {
    const dayOfWeek = date.getDay()
    const dayOfMonth = date.getDate()
    const month = date.getMonth()

    const recommendations = {
      favorable: [] as string[],
      avoid: [] as string[],
      energy: "neutral" as "favorable" | "challenging" | "neutral",
    }

    // Basic logic based on day of week (planets)
    switch (dayOfWeek) {
      case 0: // Sunday - Sun
        recommendations.favorable = ["creativity", "health", "personal"]
        recommendations.avoid = ["work"]
        recommendations.energy = "favorable"
        break
      case 1: // Monday - Moon
        recommendations.favorable = ["personal", "health"]
        recommendations.avoid = ["creativity", "finance"]
        recommendations.energy = "neutral"
        break
      case 2: // Tuesday - Mars
        recommendations.favorable = ["work", "finance"]
        recommendations.avoid = ["relationships"]
        recommendations.energy = "challenging"
        break
      case 3: // Wednesday - Mercury
        recommendations.favorable = ["work", "personal", "health"]
        recommendations.avoid = []
        recommendations.energy = "favorable"
        break
      case 4: // Thursday - Jupiter
        recommendations.favorable = ["work", "finance", "relationships"]
        recommendations.avoid = []
        recommendations.energy = "favorable"
        break
      case 5: // Friday - Venus
        recommendations.favorable = ["creativity", "relationships", "personal"]
        recommendations.avoid = ["work"]
        recommendations.energy = "favorable"
        break
      case 6: // Saturday - Saturn
        recommendations.favorable = ["health", "personal"]
        recommendations.avoid = ["work", "finance", "creativity"]
        recommendations.energy = "challenging"
        break
    }

    // Additional modifications based on date of month
    if (dayOfMonth <= 7) {
      // First week of month - new beginnings
      if (recommendations.energy !== "challenging") {
        recommendations.energy = "favorable"
      }
      recommendations.favorable.push("personal")
    } else if (dayOfMonth >= 22) {
      // Last week of month - completing tasks
      recommendations.favorable.push("work")
      if (dayOfMonth >= 28) {
        recommendations.avoid.push("creativity")
      }
    }

    // Special days of month
    if (dayOfMonth % 8 === 0) {
      recommendations.favorable.push("finance")
    }
    if (dayOfMonth % 7 === 0) {
      recommendations.avoid.push("work")
    }
    if (dayOfMonth === 15) {
      // Middle of month - balance
      recommendations.energy = "favorable"
      recommendations.favorable.push("relationships")
    }

    // Modifications based on month
    if (month === 0 || month === 11) {
      // January and December - planning time
      recommendations.favorable.push("personal")
    }
    if (month >= 2 && month <= 4) {
      // Spring - creativity time
      recommendations.favorable.push("creativity")
    }
    if (month >= 5 && month <= 7) {
      // Summer - activity time
      recommendations.favorable.push("health")
    }
    if (month >= 8 && month <= 10) {
      // Autumn - work time
      recommendations.favorable.push("work")
    }

    // Overall day energy based on all factors
    const favorableCount = recommendations.favorable.length
    const avoidCount = recommendations.avoid.length

    if (favorableCount > avoidCount + 2) {
      recommendations.energy = "favorable"
    } else if (avoidCount > favorableCount + 1) {
      recommendations.energy = "challenging"
    } else {
      recommendations.energy = "neutral"
    }

    // Unique values
    recommendations.favorable = [...new Set(recommendations.favorable)]
    recommendations.avoid = [...new Set(recommendations.avoid)]

    return recommendations
  }

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      work: "🏢",
      personal: "👤",
      health: "💪",
      creativity: "🎨",
      relationships: "❤️",
      finance: "💰",
    }
    return emojis[category as keyof typeof emojis] || "📝"
  }

  const getCategoryName = (category: string) => {
    const names = {
      work: "Work",
      personal: "Personal",
      health: "Health",
      creativity: "Creativity",
      relationships: "Relationships",
      finance: "Finance",
    }
    return names[category as keyof typeof names] || category
  }

  const getDayColor = (energy: string) => {
    switch (energy) {
      case "favorable":
        return "bg-green-100 hover:bg-green-200 border-green-200"
      case "challenging":
        return "bg-red-100 hover:bg-red-200 border-red-200"
      default:
        return "bg-gray-50 hover:bg-gray-100 border-gray-200"
    }
  }

  const getTasksForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return tasks.filter((task) => task.date === dateString)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">Welcome back, {birthData.name}</CardTitle>
                  <p className="text-gray-600 text-sm">
                    Born {format(birthData.dateOfBirth, "MMMM d, yyyy")} in {birthData.placeOfBirth}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={onNavigateToProfile} variant="outline" className="bg-white/50">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button onClick={onNavigateToTasks} variant="outline" className="bg-white/50">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Tasks
                </Button>
                <Button onClick={onLogout} variant="outline" className="text-red-600 hover:text-red-700 bg-white/50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar */}
        <div className="flex flex-col xl:flex-row gap-6">
          <Card className="flex-1 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6" />
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth} className="bg-white/50 border-gray-200">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth} className="bg-white/50 border-gray-200">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-3">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const recommendations = getDayRecommendations(day)
                  const dayTasks = getTasksForDate(day)
                  const isCurrentMonth = isSameMonth(day, currentDate)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
          h-20 p-1 rounded-md border-2 transition-all duration-200 relative overflow-hidden
          ${isCurrentMonth ? getDayColor(recommendations.energy) : "bg-gray-50 border-gray-100 opacity-50"}
          ${isToday(day) ? "ring-2 ring-purple-400" : ""}
          hover:scale-105 hover:shadow-md
        `}
                    >
                      <div className="text-xs font-medium text-gray-800 mb-1">{format(day, "d")}</div>

                      {/* All icons in one line with enhanced crossed-out styling */}
                      <div className="flex flex-wrap justify-center gap-0.5 mb-1">
                        {/* Favorable categories */}
                        {recommendations.favorable.slice(0, 3).map((category) => (
                          <span
                            key={`fav-${category}`}
                            className="text-sm"
                            title={`Favorable: ${getCategoryName(category)}`}
                          >
                            {getCategoryEmoji(category)}
                          </span>
                        ))}

                        {/* Categories to avoid - more emphasized crossing out */}
                        {recommendations.avoid.slice(0, 2).map((category) => (
                          <span
                            key={`avoid-${category}`}
                            className="text-sm relative"
                            title={`Avoid: ${getCategoryName(category)}`}
                          >
                            <span className="opacity-40 grayscale">{getCategoryEmoji(category)}</span>
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-full h-0.5 bg-red-500 rotate-45 transform scale-150"></span>
                            </span>
                          </span>
                        ))}
                      </div>

                      {/* Task indicator */}
                      {dayTasks.length > 0 && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legend - right column */}
          <div className="xl:w-80 space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded border border-green-300"></div>
                    <span className="text-sm text-gray-600">Favorable day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded border border-red-300"></div>
                    <span className="text-sm text-gray-600">Challenging day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded border border-gray-200"></div>
                    <span className="text-sm text-gray-600">Neutral day</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Categories:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏢</span>
                      <span className="text-sm text-gray-700">Work</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">👤</span>
                      <span className="text-sm text-gray-700">Personal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">💪</span>
                      <span className="text-sm text-gray-700">Health</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎨</span>
                      <span className="text-sm text-gray-700">Creativity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">❤️</span>
                      <span className="text-sm text-gray-700">Relationships</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">💰</span>
                      <span className="text-sm text-gray-700">Finance</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 mt-3">
                    ✨ Regular emojis = favorable
                    <br />🚫 Crossed out = avoid
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          energy={getDayRecommendations(selectedDate).energy}
          tasks={getTasksForDate(selectedDate)}
          recommendations={getDayRecommendations(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      )}
    </div>
  )
}
