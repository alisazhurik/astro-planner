"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Calendar,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Briefcase,
  Heart,
  Palette,
  DollarSign,
  Activity,
  User,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Brain,
  Wand2,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { format, addDays, startOfWeek } from "date-fns"
import type { BirthData, Task } from "@/app/page"

interface TaskListProps {
  birthData: BirthData
  tasks: Task[]
  onAddTask: (task: Omit<Task, "id">) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onNavigateToCalendar: () => void
  onNavigateToProfile: () => void
  onLogout: () => void
}

// AI function for task category prediction
const predictTaskCategory = (taskText: string): { category: Task["category"]; confidence: number } => {
  const text = taskText.toLowerCase()

  // Keywords for each category
  const categoryKeywords = {
    work: [
      "work",
      "project",
      "meeting",
      "presentation",
      "report",
      "deadline",
      "client",
      "colleague",
      "office",
      "task",
      "conference",
      "email",
      "documents",
      "contract",
      "budget",
      "analysis",
      "strategy",
      "planning",
      "development",
      "job",
    ],
    health: [
      "doctor",
      "sport",
      "training",
      "gym",
      "running",
      "yoga",
      "diet",
      "vitamins",
      "health",
      "fitness",
      "massage",
      "dentist",
      "tests",
      "examination",
      "medicine",
      "procedure",
      "meditation",
      "sleep",
      "rest",
      "relax",
    ],
    finance: [
      "money",
      "bank",
      "account",
      "payment",
      "credit",
      "investment",
      "budget",
      "taxes",
      "insurance",
      "pension",
      "salary",
      "savings",
      "expenses",
      "income",
      "finance",
      "buy",
      "sell",
      "pay",
      "transfer",
      "accumulation",
    ],
    creativity: [
      "drawing",
      "music",
      "creativity",
      "hobby",
      "art",
      "photo",
      "video",
      "design",
      "write",
      "blog",
      "instagram",
      "content",
      "idea",
      "inspiration",
      "project",
      "create",
      "invent",
      "experiment",
      "workshop",
      "course",
    ],
    relationships: [
      "family",
      "friends",
      "date",
      "meeting",
      "conversation",
      "call",
      "visit",
      "celebration",
      "birthday",
      "gift",
      "relationship",
      "love",
      "partner",
      "children",
      "parents",
      "relatives",
      "wedding",
      "party",
      "communication",
      "conflict",
    ],
    personal: [
      "personal",
      "self-development",
      "learning",
      "book",
      "course",
      "goal",
      "planning",
      "organization",
      "cleaning",
      "shopping",
      "home",
      "repair",
      "travel",
      "vacation",
      "hobby",
      "development",
      "skills",
      "habits",
      "routine",
      "plan",
    ],
  }

  let bestCategory: Task["category"] = "personal"
  let maxScore = 0

  // Calculate scores for each category
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    let score = 0
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += 1
        // Extra points if keyword is at the beginning
        if (text.startsWith(keyword)) {
          score += 0.5
        }
      }
    })

    if (score > maxScore) {
      maxScore = score
      bestCategory = category as Task["category"]
    }
  })

  // Calculate confidence (0-100%)
  const confidence = Math.min(Math.round((maxScore / Math.max(text.split(" ").length * 0.3, 1)) * 100), 95)

  return { category: bestCategory, confidence: Math.max(confidence, 15) }
}

// Function to determine zodiac sign
const getZodiacSign = (birthDate: Date): { sign: string; emoji: string } => {
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Aries", emoji: "♈" }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Taurus", emoji: "♉" }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "Gemini", emoji: "♊" }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Cancer", emoji: "♋" }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Leo", emoji: "♌" }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Virgo", emoji: "♍" }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Libra", emoji: "♎" }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Scorpio", emoji: "♏" }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Sagittarius", emoji: "♐" }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: "Capricorn", emoji: "♑" }
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Aquarius", emoji: "♒" }
  return { sign: "Pisces", emoji: "♓" }
}

// Function to generate humorous horoscope
const getPriorityFlag = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return <span className="text-red-600 text-sm">🚩</span>
    case "medium":
      return <span className="text-yellow-600 text-sm">🚩</span>
    case "low":
      return <span className="text-green-600 text-sm">🚩</span>
  }
}

const generateAdvancedHoroscope = (zodiacSign: string, name: string, date: Date): string => {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const moonPhase = (dayOfYear % 29.5) / 29.5
  const weekDay = date.getDay()

  // Planetary influences
  const planetaryInfluence =
    {
      0: "Sun",
      1: "Moon",
      2: "Mars",
      3: "Mercury",
      4: "Jupiter",
      5: "Venus",
      6: "Saturn",
    }[weekDay] || "Sun"

  // Generate unique seed
  const seed = `${zodiacSign}-${date.toDateString()}`.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const shorterHoroscopes = {
    Aries: [
      `🔥 **${name}, your Aries fire burns bright today!** 🔥\n\n${planetaryInfluence} energizes your natural leadership, making this perfect for bold initiatives. Your ruling planet Mars sends courage through your being - trust your instincts and take that challenging step you've been considering.\n\n**Energy Focus**: Professional breakthroughs and meaningful conversations await. Your charisma attracts positive attention.\n\n**Lucky Color**: Crimson Red 🔴\n**Affirmation**: "I am a fearless leader supported by the universe!"`,

      `⚡ **Dynamic energy surrounds you, ${name}!** ⚡\n\n${planetaryInfluence} creates powerful opportunities during today's cosmic alignment. Your natural magnetism and pioneering spirit open new doors - don't hesitate to present your ideas.\n\n**Focus Areas**: Career advancement and relationship harmony. Channel your vitality into physical activities or creative pursuits.\n\n**Cosmic Tip**: Wear red today to amplify your natural power! 🌟`,
    ],
    Taurus: [
      `🌱 **Grounded abundance flows to you, ${name}** 🌱\n\nVenus dances with ${planetaryInfluence} today, creating harmony between beauty and prosperity. Your practical wisdom shines in financial matters - trust your instincts about material security.\n\n**Highlights**: Creative expression flourishes and your steady nature attracts deeper bonds. Perfect time for home improvements or artistic pursuits.\n\n**Power Color**: Emerald Green 💚\n**Affirmation**: "I am grounded in abundance and prosperity flows naturally!"`,

      `💎 **Luxury and stability bless you today, ${name}** 💎\n\n${planetaryInfluence} brings both material and spiritual rewards. Your domestic sphere is especially blessed - enjoy comfort, good food, and beautiful surroundings.\n\n**Focus**: Long-term goals receive cosmic support. Your ability to turn dreams into reality is potent today.\n\n**Evening Ritual**: Light a green candle and reflect on your blessings! 🕯️✨`,
    ],
    Gemini: [
      `🌪️ **Mental brilliance sparkles, ${name}!** 🌪️\n\nMercury creates intellectual stimulation with ${planetaryInfluence} today. Your words carry extra power - whether writing, speaking, or listening, you're a conduit for important information.\n\n**Strengths**: Learning accelerates and social connections flourish. You're the bridge between different worlds today.\n\n**Lucky Color**: Electric Blue ⚡\n**Affirmation**: "I am a brilliant communicator creating positive change!"`,
    ],
    Cancer: [
      `🌙 **Lunar wisdom embraces you, ${name}** 🌙\n\nThe Moon blesses you with emotional insight as ${planetaryInfluence} creates waves of intuitive wisdom. Trust your gut feelings - they're divine messages guiding you.\n\n**Focus**: Family connections deepen and your nurturing nature heals others. Creative imagination flows vividly.\n\n**Power Color**: Pearl White 🤍\n**Affirmation**: "I trust my intuition completely - it guides me perfectly!"`,
    ],
    Leo: [
      `👑 **Royal radiance shines through you, ${name}!** 👑\n\nThe Sun blazes with extra brilliance as ${planetaryInfluence} amplifies your natural charisma. You're born to lead - step into your power and inspire others with your vision.\n\n**Highlights**: Creative talents shine and recognition comes your way. Your generous spirit creates positive karma.\n\n**Power Color**: Royal Gold 👑\n**Affirmation**: "I am radiant light brightening the world!"`,
    ],
    Virgo: [
      `🔍 **Precision and perfection guide you, ${name}** 🔍\n\nMercury blesses your analytical mind with ${planetaryInfluence}'s wisdom. Your organizational mastery turns chaos into order - systems and detailed planning lead to remarkable results.\n\n**Focus**: Health wisdom speaks clearly and your service to others makes real difference.\n\n**Power Color**: Forest Green 🌲\n**Affirmation**: "I create perfect order and harmony in everything!"`,
    ],
    Libra: [
      `⚖️ **Harmony and beauty surround you, ${name}** ⚖️\n\nVenus creates exquisite balance with ${planetaryInfluence}, bringing diplomatic success. Your natural charm opens doors and your sense of justice guides important decisions.\n\n**Strengths**: Relationship harmony and aesthetic appreciation. You're the peacemaker creating understanding.\n\n**Power Color**: Soft Pink 🌸\n**Affirmation**: "I create harmony and beauty wherever I go!"`,
    ],
    Scorpio: [
      `🦂 **Transformative power flows through you, ${name}** 🦂\n\nPluto merges with ${planetaryInfluence} creating profound rebirth opportunities. Your intuitive abilities reach supernatural levels - trust what you sense beneath the surface.\n\n**Focus**: Hidden truths reveal themselves and emotional depth becomes your strength.\n\n**Power Color**: Deep Crimson 🔴\n**Affirmation**: "I embrace my power to transform completely!"`,
    ],
    Sagittarius: [
      `🏹 **Adventure and wisdom call to you, ${name}!** 🏹\n\nJupiter expands horizons through ${planetaryInfluence}'s influence. Your quest for truth reaches new heights - spiritual studies and cultural exploration feed your soul.\n\n**Energy**: Optimistic spirit inspires others and freedom beckons. Every adventure leads to wisdom.\n\n**Power Color**: Royal Purple 💜\n**Affirmation**: "I explore infinite possibilities with complete freedom!"`,
    ],
    Capricorn: [
      `🏔️ **Achievement and authority favor you, ${name}** 🏔️\n\nSaturn's discipline combines with ${planetaryInfluence} creating foundations for lasting success. Your reputation for excellence opens important doors and new responsibilities.\n\n**Focus**: Long-term planning and practical magic turn dreams into reality.\n\n**Power Color**: Charcoal Gray ⚫\n**Affirmation**: "I am a master builder of my destiny!"`,
    ],
    Aquarius: [
      `⚡ **Innovation and vision electrify you, ${name}!** ⚡\n\nUranus sparks revolutionary ideas with ${planetaryInfluence}'s energy. Your technological affinity brings exciting discoveries and humanitarian impulses strengthen.\n\n**Highlights**: Unique perspective provides breakthrough solutions and social networks inspire.\n\n**Power Color**: Electric Blue ⚡\n**Affirmation**: "I channel positive change with my unique vision!"`,
    ],
    Pisces: [
      `🌊 **Mystical compassion flows through you, ${name}** 🌊\n\nNeptune's ethereal energy heightens psychic abilities through ${planetaryInfluence}'s channel. Spiritual connection brings divine guidance and artistic inspiration knows no bounds.\n\n**Focus**: Dream messages and emotional healing through compassionate presence.\n\n**Power Color**: Ocean Blue 🌊\n**Affirmation**: "I am a vessel of divine love transforming the world!"`,
    ],
  }

  const signHoroscopes = shorterHoroscopes[zodiacSign as keyof typeof shorterHoroscopes] || shorterHoroscopes["Aries"]
  const index = Math.abs(seed) % signHoroscopes.length
  return signHoroscopes[index]
}

export function TaskList({
  birthData,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onNavigateToCalendar,
  onNavigateToProfile,
  onLogout,
}: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("personal")
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [editCategory, setEditCategory] = useState<Task["category"]>("personal")
  const [editPriority, setEditPriority] = useState<Task["priority"]>("medium")
  const [aiPrediction, setAiPrediction] = useState<{ category: Task["category"]; confidence: number } | null>(null)
  const [isAiSuggested, setIsAiSuggested] = useState(false)
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const categoryIcons = {
    work: <Briefcase className="w-4 h-4" />,
    personal: <User className="w-4 h-4" />,
    health: <Activity className="w-4 h-4" />,
    creativity: <Palette className="w-4 h-4" />,
    relationships: <Heart className="w-4 h-4" />,
    finance: <DollarSign className="w-4 h-4" />,
  }

  const categoryColors = {
    work: "bg-blue-100 text-blue-800 border-blue-200",
    personal: "bg-purple-100 text-purple-800 border-purple-200",
    health: "bg-green-100 text-green-800 border-green-200",
    creativity: "bg-orange-100 text-orange-800 border-orange-200",
    relationships: "bg-pink-100 text-pink-800 border-pink-200",
    finance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-blue-100 text-blue-600",
    high: "bg-red-100 text-red-600",
  }

  const getCategoryName = (category: Task["category"]) => {
    const names = {
      work: "Work",
      personal: "Personal",
      health: "Health",
      creativity: "Creativity",
      relationships: "Relationships",
      finance: "Finance",
    }
    return names[category]
  }

  // AI prediction when task text changes
  useEffect(() => {
    if (newTaskText.trim().length > 3) {
      const prediction = predictTaskCategory(newTaskText)
      setAiPrediction(prediction)

      // Automatically set category only if confidence > 30%
      if (prediction.confidence > 30 && !isAiSuggested) {
        setNewTaskCategory(prediction.category)
        setIsAiSuggested(true)
      }
    } else {
      setAiPrediction(null)
      setIsAiSuggested(false)
    }
  }, [newTaskText, isAiSuggested])

  // Astrological logic for determining favorable days
  const getTaskRecommendations = (category: Task["category"]) => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const recommendations = []

    for (let i = 0; i < 14; i++) {
      const date = addDays(weekStart, i)
      const dayOfWeek = date.getDay()
      const dayOfMonth = date.getDate()

      let energy = "neutral"
      let reason = ""

      // Simplified astrological logic for demo
      switch (category) {
        case "work":
          if (dayOfWeek === 2 || dayOfWeek === 4) {
            // Tuesday and Thursday - Mars and Jupiter days
            energy = "favorable"
            reason = "Mars gives energy for work"
          } else if (dayOfWeek === 6) {
            // Saturday
            energy = "challenging"
            reason = "Rest day, not for work"
          }
          break

        case "creativity":
          if (dayOfWeek === 5 || dayOfWeek === 0) {
            // Friday and Sunday - Venus and Sun days
            energy = "favorable"
            reason = "Venus inspires creativity"
          } else if (dayOfWeek === 1) {
            energy = "challenging"
            reason = "Monday - not for creativity"
          }
          break

        case "relationships":
          if (dayOfWeek === 5 || dayOfWeek === 0) {
            // Friday and Sunday
            energy = "favorable"
            reason = "Venus favors relationships"
          } else if (dayOfWeek === 2) {
            energy = "challenging"
            reason = "Mars can cause conflicts"
          }
          break

        case "health":
          if (dayOfWeek === 3 || dayOfWeek === 0) {
            // Wednesday and Sunday
            energy = "favorable"
            reason = "Mercury and Sun give life force"
          }
          break

        case "finance":
          if (dayOfWeek === 4 || dayOfMonth % 8 === 0) {
            // Thursday - Jupiter's day
            energy = "favorable"
            reason = "Jupiter brings luck in finances"
          } else if (dayOfWeek === 6) {
            energy = "challenging"
            reason = "Saturn may limit finances"
          }
          break

        case "personal":
          if (dayOfWeek === 1 || dayOfWeek === 3) {
            energy = "favorable"
            reason = "Good time for personal matters"
          }
          break
      }

      recommendations.push({
        date,
        energy,
        reason,
      })
    }

    return recommendations
  }

  // Function to get favorable days for specific task
  const getTaskDays = (task: Task) => {
    const recommendations = getTaskRecommendations(task.category)
    const favorable = recommendations.filter((r) => r.energy === "favorable")
    const challenging = recommendations.filter((r) => r.energy === "challenging")

    return {
      favorable: favorable.slice(0, 3),
      challenging: challenging.slice(0, 2),
    }
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      onAddTask({
        text: newTaskText.trim(),
        category: newTaskCategory,
        priority: newTaskPriority,
        date: "",
        completed: false,
      })
      setNewTaskText("")
      setAiPrediction(null)
      setIsAiSuggested(false)
      setNewTaskCategory("personal")
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id)
    setEditText(task.text)
    setEditCategory(task.category)
    setEditPriority(task.priority)
  }

  const handleSaveEdit = (taskId: string) => {
    if (editText.trim()) {
      onUpdateTask(taskId, {
        text: editText.trim(),
        category: editCategory,
        priority: editPriority,
      })
    }
    setEditingTask(null)
    setEditText("")
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setEditText("")
  }

  const handleCategoryChange = (value: Task["category"]) => {
    setNewTaskCategory(value)
    setIsAiSuggested(false) // User manually changed category
  }

  const toggleCategory = (category: string) => {
    const newOpenCategories = new Set(openCategories)
    if (newOpenCategories.has(category)) {
      newOpenCategories.delete(category)
    } else {
      newOpenCategories.add(category)
    }
    setOpenCategories(newOpenCategories)
  }

  const incompleteTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
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
                <Button onClick={onNavigateToCalendar} variant="outline" className="bg-white/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button onClick={onLogout} variant="outline" className="text-red-600 hover:text-red-700 bg-white/50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Management */}
          <div className="space-y-6">
            {/* Add Task Form */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Task
                  {aiPrediction && (
                    <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
                      <Brain className="w-3 h-3 mr-1" />
                      AI: {aiPrediction.confidence}%
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleAddTask} className="space-y-3">
                  <Input
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full"
                  />

                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Select value={newTaskCategory} onValueChange={handleCategoryChange}>
                        <SelectTrigger className={`${isAiSuggested ? "ring-2 ring-purple-200 bg-purple-50" : ""}`}>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">🏢 Work</SelectItem>
                          <SelectItem value="personal">👤 Personal</SelectItem>
                          <SelectItem value="health">💪 Health</SelectItem>
                          <SelectItem value="creativity">🎨 Creativity</SelectItem>
                          <SelectItem value="relationships">❤️ Relationships</SelectItem>
                          <SelectItem value="finance">💰 Finance</SelectItem>
                        </SelectContent>
                      </Select>
                      {isAiSuggested && (
                        <div className="absolute -top-2 -right-2">
                          <Wand2 className="w-4 h-4 text-purple-500" />
                        </div>
                      )}
                    </div>

                    <Select
                      value={newTaskPriority}
                      onValueChange={(value: Task["priority"]) => setNewTaskPriority(value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🚩 Low</SelectItem>
                        <SelectItem value="medium">🚩 Medium</SelectItem>
                        <SelectItem value="high">🚩 High</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-4"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* AI Prediction Info */}
                  {aiPrediction && aiPrediction.confidence > 30 && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <Brain className="w-4 h-4" />
                        <span>
                          AI recommends <strong>{getCategoryName(aiPrediction.category)}</strong> category (confidence:{" "}
                          {aiPrediction.confidence}%)
                        </span>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Active Tasks */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Active Tasks ({incompleteTasks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incompleteTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No active tasks</p>
                  ) : (
                    incompleteTasks.map((task) => {
                      const taskDays = getTaskDays(task)
                      return (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg border">
                          {editingTask === task.id ? (
                            // Edit Mode
                            <div className="space-y-3">
                              <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit(task.id)
                                  if (e.key === "Escape") handleCancelEdit()
                                }}
                              />
                              <div className="flex gap-2">
                                <Select
                                  value={editCategory}
                                  onValueChange={(value: Task["category"]) => setEditCategory(value)}
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="work">🏢 Work</SelectItem>
                                    <SelectItem value="personal">👤 Personal</SelectItem>
                                    <SelectItem value="health">💪 Health</SelectItem>
                                    <SelectItem value="creativity">🎨 Creativity</SelectItem>
                                    <SelectItem value="relationships">❤️ Relationships</SelectItem>
                                    <SelectItem value="finance">💰 Finance</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={editPriority}
                                  onValueChange={(value: Task["priority"]) => setEditPriority(value)}
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">🚩 Low</SelectItem>
                                    <SelectItem value="medium">🚩 Medium</SelectItem>
                                    <SelectItem value="high">🚩 High</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(task.id)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => onToggleTask(task.id)}
                                  className="mt-0.5"
                                />

                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-800 font-medium truncate mb-1">{task.text}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`${categoryColors[task.category]} text-xs`}>
                                      {categoryIcons[task.category]}
                                      <span className="ml-1">{getCategoryName(task.category)}</span>
                                    </Badge>
                                    <span className="text-xs ml-1">{getPriorityFlag(task.priority)}</span>
                                  </div>
                                </div>

                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeleteTask(task.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Astrological days for task */}
                              <div className="text-xs space-y-1 pl-8">
                                {taskDays.favorable.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                    <span className="text-green-700 font-medium">Favorable:</span>
                                    <span className="text-green-600">
                                      {taskDays.favorable.map((day) => format(day.date, "MMM d")).join(", ")}
                                    </span>
                                  </div>
                                )}
                                {taskDays.challenging.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-red-600" />
                                    <span className="text-red-700 font-medium">Challenging:</span>
                                    <span className="text-red-600">
                                      {taskDays.challenging.map((day) => format(day.date, "MMM d")).join(", ")}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800">Completed Tasks ({completedTasks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {completedTasks.map((task) => (
                      <div key={task.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={task.completed} onCheckedChange={() => onToggleTask(task.id)} />
                          <span className="flex-1 text-gray-600 line-through">{task.text}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Daily AI Horoscope */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 mb-4">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Daily Forecast
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  {format(new Date(), "EEEE, MMMM d, yyyy")} • {getZodiacSign(birthData.dateOfBirth).emoji}{" "}
                  {getZodiacSign(birthData.dateOfBirth).sign}
                </p>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <p className="text-gray-700 leading-relaxed">
                    {generateAdvancedHoroscope(getZodiacSign(birthData.dateOfBirth).sign, birthData.name, new Date())}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Astro Recommendations - Accordion */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Astrological Recommendations
                </CardTitle>
                <p className="text-gray-600 text-sm">Best days for your tasks in the next 2 weeks</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(incompleteTasks.map((task) => task.category))).map((category) => {
                    const recommendations = getTaskRecommendations(category)
                    const favorableDays = recommendations.filter((r) => r.energy === "favorable")
                    const challengingDays = recommendations.filter((r) => r.energy === "challenging")
                    const isOpen = openCategories.has(category)

                    return (
                      <Collapsible key={category} open={isOpen} onOpenChange={() => toggleCategory(category)}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between p-3 h-auto bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              {categoryIcons[category]}
                              <span className="font-semibold text-gray-800">{getCategoryName(category)}</span>
                              <Badge variant="secondary" className="text-xs">
                                {incompleteTasks.filter((task) => task.category === category).length}
                              </Badge>
                            </div>
                            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3 pt-3">
                          {favorableDays.length > 0 && (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">Favorable Days:</span>
                              </div>
                              <div className="space-y-1">
                                {favorableDays.slice(0, 3).map((rec) => (
                                  <div key={rec.date.toISOString()} className="text-sm text-green-700">
                                    <span className="font-medium">{format(rec.date, "EEEE, MMMM d")}</span>
                                    <span className="text-green-600 ml-2">- {rec.reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {challengingDays.length > 0 && (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-800">Challenging Days:</span>
                              </div>
                              <div className="space-y-1">
                                {challengingDays.slice(0, 2).map((rec) => (
                                  <div key={rec.date.toISOString()} className="text-sm text-red-700">
                                    <span className="font-medium">{format(rec.date, "EEEE, MMMM d")}</span>
                                    <span className="text-red-600 ml-2">- {rec.reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}

                  {incompleteTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Add tasks to see astrological recommendations</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
