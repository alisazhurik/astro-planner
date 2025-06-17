"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, MapPin, User } from "lucide-react";
import type { BirthData } from "@/app/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
}

export function BirthDataForm({ onSubmit }: BirthDataFormProps) {
  const [name, setName] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      name &&
      birthMonth &&
      birthDay &&
      birthYear &&
      timeOfBirth &&
      placeOfBirth
    ) {
      const dateOfBirth = new Date(
        Number.parseInt(birthYear),
        Number.parseInt(birthMonth) - 1,
        Number.parseInt(birthDay)
      );
      onSubmit({
        name,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-white">
            Tell us about yourself
          </CardTitle>
          <p className="text-purple-100">
            We need your birth details to personalize your astro experience
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-white flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Date of Birth
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={birthMonth} onValueChange={setBirthMonth}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {format(new Date(2000, i, 1), "MMMM")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={birthDay} onValueChange={setBirthDay}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={birthYear} onValueChange={setBirthYear}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="time"
                className="text-white flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Time of Birth
              </Label>
              <Input
                id="time"
                type="time"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="place"
                className="text-white flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Place of Birth
              </Label>
              <Input
                id="place"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="City, Country"
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Continue to Calendar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
