"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  CalendarIcon,
  Clock,
  MapPin,
  LogOut,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import type { BirthData, User as UserType } from "@/app/page";

interface UserProfileProps {
  user: UserType;
  onUpdateBirthData: (data: BirthData) => void;
  onBack: () => void;
  onLogout: () => void;
}

export function UserProfile({
  user,
  onUpdateBirthData,
  onBack,
  onLogout,
}: UserProfileProps) {
  const dateOfBirth: Date | undefined = user.birthData?.dateOfBirth
    ? typeof user.birthData.dateOfBirth === "string"
      ? new Date(user.birthData.dateOfBirth)
      : user.birthData.dateOfBirth
    : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.birthData?.name || "");
  const [birthMonth, setBirthMonth] = useState(
    dateOfBirth ? (dateOfBirth.getMonth() + 1).toString() : ""
  );
  const [birthDay, setBirthDay] = useState(
    dateOfBirth ? dateOfBirth.getDate().toString() : ""
  );
  const [birthYear, setBirthYear] = useState(
    dateOfBirth ? dateOfBirth.getFullYear().toString() : ""
  );
  const [timeOfBirth, setTimeOfBirth] = useState(
    user.birthData?.timeOfBirth || ""
  );
  const [placeOfBirth, setPlaceOfBirth] = useState(
    user.birthData?.placeOfBirth || ""
  );

  const handleSave = () => {
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

      onUpdateBirthData({
        name,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
      });

      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(user.birthData?.name || "");
    setBirthMonth(
      user.birthData?.dateOfBirth
        ? (user.birthData.dateOfBirth.getMonth() + 1).toString()
        : ""
    );
    setBirthDay(
      user.birthData?.dateOfBirth
        ? user.birthData.dateOfBirth.getDate().toString()
        : ""
    );
    setBirthYear(
      user.birthData?.dateOfBirth
        ? user.birthData.dateOfBirth.getFullYear().toString()
        : ""
    );
    setTimeOfBirth(user.birthData?.timeOfBirth || "");
    setPlaceOfBirth(user.birthData?.placeOfBirth || "");
    setIsEditing(false);
  };

  const getZodiacSign = (
    birthDateInput: Date | string
  ): { sign: string; emoji: string } => {
    const birthDate =
      typeof birthDateInput === "string"
        ? new Date(birthDateInput)
        : birthDateInput;
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return { sign: "Aries", emoji: "♈" };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return { sign: "Taurus", emoji: "♉" };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
      return { sign: "Gemini", emoji: "♊" };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
      return { sign: "Cancer", emoji: "♋" };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
      return { sign: "Leo", emoji: "♌" };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return { sign: "Virgo", emoji: "♍" };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
      return { sign: "Libra", emoji: "♎" };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
      return { sign: "Scorpio", emoji: "♏" };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return { sign: "Sagittarius", emoji: "♐" };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return { sign: "Capricorn", emoji: "♑" };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return { sign: "Aquarius", emoji: "♒" };
    return { sign: "Pisces", emoji: "♓" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    User Profile
                  </CardTitle>
                  <p className="text-gray-600 text-sm">@{user.username}</p>
                </div>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Birth Information
              </CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isEditing ? (
              // Display Mode
              <div className="space-y-4">
                {user.birthData ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">
                          {getZodiacSign(user.birthData.dateOfBirth).emoji}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {user.birthData.name}
                      </h2>
                      <p className="text-lg text-purple-600">
                        {getZodiacSign(user.birthData.dateOfBirth).sign}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-700">
                            Date of Birth
                          </span>
                        </div>
                        <p className="text-gray-800">
                          {format(user.birthData.dateOfBirth, "MMMM d, yyyy")}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-700">
                            Time of Birth
                          </span>
                        </div>
                        <p className="text-gray-800">
                          {user.birthData.timeOfBirth}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-700">
                            Place of Birth
                          </span>
                        </div>
                        <p className="text-gray-800">
                          {user.birthData.placeOfBirth}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-2">
                        Statistics
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-600">Total Tasks:</span>
                          <span className="ml-2 font-medium">
                            {user.tasks.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-600">Completed:</span>
                          <span className="ml-2 font-medium">
                            {user.tasks.filter((t) => t.completed).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No birth data available</p>
                    <Button onClick={() => setIsEditing(true)} className="mt-4">
                      Add Birth Information
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Date of Birth
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={birthMonth} onValueChange={setBirthMonth}>
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Time of Birth
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={timeOfBirth}
                    onChange={(e) => setTimeOfBirth(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="place"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Place of Birth
                  </Label>
                  <Input
                    id="place"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
