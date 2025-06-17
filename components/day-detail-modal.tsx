"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@/app/page";

interface DayDetailModalProps {
  date: Date;
  energy: string;
  tasks: Task[];
  recommendations: {
    favorable: string[];
    avoid: string[];
    energy: "favorable" | "challenging" | "neutral";
  };
  onClose: () => void;
  onAddTask: (task: Omit<Task, "id">) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function DayDetailModal({
  date,
  energy,
  tasks,
  recommendations,
  onClose,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: DayDetailModalProps) {
  const [newTaskText, setNewTaskText] = useState("");

  const getEnergyInfo = (energy: string) => {
    switch (energy) {
      case "favorable":
        return {
          icon: <Sparkles className="w-5 h-5 text-green-600" />,
          title: "Favorable Day",
          description: "Good day for active actions and important decisions.",
          color: "text-green-700",
          bgColor: "bg-green-50",
        };
      case "challenging":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          title: "Challenging Day",
          description: "Be careful, avoid important decisions.",
          color: "text-red-700",
          bgColor: "bg-red-50",
        };
      default:
        return {
          icon: <CheckCircle className="w-5 h-5 text-gray-600" />,
          title: "Neutral Day",
          description: "Balanced day for routine tasks.",
          color: "text-gray-700",
          bgColor: "bg-gray-50",
        };
    }
  };

  const getCategoryName = (category: string) => {
    const names = {
      work: "Work",
      personal: "Personal",
      health: "Health",
      creativity: "Creativity",
      relationships: "Relationships",
      finance: "Finance",
    };
    return names[category as keyof typeof names] || category;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      work: "🏢",
      personal: "👤",
      health: "💪",
      creativity: "🎨",
      relationships: "❤️",
      finance: "💰",
    };
    return emojis[category as keyof typeof emojis] || "📝";
  };

  const energyInfo = getEnergyInfo(energy);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask({
        text: newTaskText.trim(),
        date: format(date, "yyyy-MM-dd"),
        completed: false,
        category: "personal",
        // priority: "medium",
      });
      setNewTaskText("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white shadow-2xl border-0 max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-800">
              {format(date, "EEEE, MMMM d")}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto">
          {/* Astro Weather */}
          <div className={`p-4 rounded-lg ${energyInfo.bgColor}`}>
            <div className="flex items-center gap-3 mb-2">
              {energyInfo.icon}
              <h3 className={`font-semibold ${energyInfo.color}`}>
                {energyInfo.title}
              </h3>
            </div>
            <p className={`text-sm ${energyInfo.color} mb-3`}>
              {energyInfo.description}
            </p>

            {/* Favorable categories */}
            {recommendations.favorable.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Favorable:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recommendations.favorable.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                    >
                      {getCategoryEmoji(category)}
                      {getCategoryName(category)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categories to avoid */}
            {recommendations.avoid.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Better to avoid:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recommendations.avoid.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
                    >
                      {getCategoryEmoji(category)}
                      {getCategoryName(category)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tasks Section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Tasks for this day
            </h3>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <Input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add task..."
                className="flex-1"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </form>

            {/* Task List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No tasks for this day
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onToggleTask(task.id)}
                    />
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {task.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
