"use client"

import { useState, useEffect } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { BirthDataForm } from "@/components/birth-data-form"
import { CalendarView } from "@/components/calendar-view"
import { TaskList } from "@/components/task-list"
import { LoginScreen } from "@/components/login-screen"
import { UserProfile } from "@/components/user-profile"

export interface BirthData {
  name: string
  dateOfBirth: Date
  timeOfBirth: string
  placeOfBirth: string
}

export interface Task {
  id: string
  text: string
  date: string
  completed: boolean
  category: "work" | "personal" | "health" | "creativity" | "relationships" | "finance"
  priority: "low" | "medium" | "high"
}

export interface User {
  id: string
  username: string
  birthData: BirthData | null
  tasks: Task[]
}

export default function AstroPlanner() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "welcome" | "form" | "calendar" | "tasks" | "profile">(
    "login",
  )
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("astro-planner-users")
    const savedCurrentUser = localStorage.getItem("astro-planner-current-user")

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }

    if (savedCurrentUser) {
      const userData = JSON.parse(savedCurrentUser)
      setCurrentUser(userData)
      if (userData.birthData) {
        setCurrentScreen("tasks")
      } else {
        setCurrentScreen("welcome")
      }
    }
  }, [])

  // Save users to localStorage whenever users array changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("astro-planner-users", JSON.stringify(users))
    }
  }, [users])

  // Save current user to localStorage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("astro-planner-current-user", JSON.stringify(currentUser))
    }
  }, [currentUser])

  const handleLogin = (username: string) => {
    let user = users.find((u) => u.username === username)

    if (!user) {
      // Create new user
      user = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        birthData: null,
        tasks: [],
      }
      setUsers((prev) => [...prev, user!])
    }

    setCurrentUser(user)

    if (user.birthData) {
      setCurrentScreen("tasks")
    } else {
      setCurrentScreen("welcome")
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("astro-planner-current-user")
    setCurrentScreen("login")
  }

  const handleGetStarted = () => {
    setCurrentScreen("form")
  }

  const handleFormSubmit = (data: BirthData) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, birthData: data }
      setCurrentUser(updatedUser)

      // Update user in users array
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)))

      setCurrentScreen("tasks")
    }
  }

  const handleAddTask = (task: Omit<Task, "id">) => {
    if (currentUser) {
      const newTask: Task = {
        ...task,
        id: Math.random().toString(36).substr(2, 9),
      }

      const updatedUser = {
        ...currentUser,
        tasks: [...currentUser.tasks, newTask],
      }

      setCurrentUser(updatedUser)
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)))
    }
  }

  const handleToggleTask = (taskId: string) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        tasks: currentUser.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
      }

      setCurrentUser(updatedUser)
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)))
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        tasks: currentUser.tasks.filter((task) => task.id !== taskId),
      }

      setCurrentUser(updatedUser)
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)))
    }
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        tasks: currentUser.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
      }

      setCurrentUser(updatedUser)
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)))
    }
  }

  const handleUpdateBirthData = (newBirthData: BirthData) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, birthData: newBirthData }
      setCurrentUser(updatedUser)
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)))
    }
  }

  if (currentScreen === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (currentScreen === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />
  }

  if (currentScreen === "form") {
    return <BirthDataForm onSubmit={handleFormSubmit} />
  }

  if (currentScreen === "profile") {
    return (
      <UserProfile
        user={currentUser}
        onUpdateBirthData={handleUpdateBirthData}
        onBack={() => setCurrentScreen("tasks")}
        onLogout={handleLogout}
      />
    )
  }

  if (currentScreen === "calendar") {
    return (
      <CalendarView
        birthData={currentUser.birthData!}
        tasks={currentUser.tasks}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onNavigateToTasks={() => setCurrentScreen("tasks")}
        onNavigateToProfile={() => setCurrentScreen("profile")}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <TaskList
      birthData={currentUser.birthData!}
      tasks={currentUser.tasks}
      onAddTask={handleAddTask}
      onToggleTask={handleToggleTask}
      onDeleteTask={handleDeleteTask}
      onUpdateTask={handleUpdateTask}
      onNavigateToCalendar={() => setCurrentScreen("calendar")}
      onNavigateToProfile={() => setCurrentScreen("profile")}
      onLogout={handleLogout}
    />
  )
}
