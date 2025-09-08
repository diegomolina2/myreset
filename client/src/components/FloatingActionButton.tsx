
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Plus,
  Droplets,
  Weight,
  Heart,
  X,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";

export function FloatingActionButton() {
  const { logWeight, logMood, logWater } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const [showWaterDialog, setShowWaterDialog] = useState(false);

  // Form states
  const [weightInput, setWeightInput] = useState("");
  const [moodInput, setMoodInput] = useState("");
  const [waterInput, setWaterInput] = useState("");

  const handleLogWeight = () => {
    const weight = parseFloat(weightInput);
    if (weight > 0) {
      logWeight(weight);
      setWeightInput("");
      setShowWeightDialog(false);
      setIsOpen(false);
    }
  };

  const handleLogMood = () => {
    const mood = parseInt(moodInput);
    if (mood >= 1 && mood <= 5) {
      logMood(mood);
      setMoodInput("");
      setShowMoodDialog(false);
      setIsOpen(false);
    }
  };

  const handleLogWater = () => {
    const water = parseFloat(waterInput);
    if (water > 0) {
      logWater(water);
      setWaterInput("");
      setShowWaterDialog(false);
      setIsOpen(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      "1": "😢",
      "2": "😔",
      "3": "😐",
      "4": "😊",
      "5": "😄",
    };
    return moodMap[mood] || "😐";
  };

  return (
    <>
      {/* Floating Action Button Container */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end">
        {/* Quick Action Options - positioned above the main button */}
        {isOpen && (
          <div className="flex flex-col items-end space-y-2 mb-4">
            <Button
              onClick={() => setShowWaterDialog(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg w-auto px-4"
              size="sm"
            >
              <Droplets className="w-4 h-4 mr-2" />
              Log Water
            </Button>
            <Button
              onClick={() => setShowWeightDialog(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg w-auto px-4"
              size="sm"
            >
              <Weight className="w-4 h-4 mr-2" />
              Log Weight
            </Button>
            <Button
              onClick={() => setShowMoodDialog(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg w-auto px-4"
              size="sm"
            >
              <Heart className="w-4 h-4 mr-2" />
              Log Mood
            </Button>
          </div>
        )}

        {/* Main FAB - always stays in the same position */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-transform hover:scale-105 flex-shrink-0"
          size="sm"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Weight Dialog */}
      <Dialog open={showWeightDialog} onOpenChange={setShowWeightDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Weight className="w-5 h-5" />
              Log Weight
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight-input">Weight (kg)</Label>
              <Input
                id="weight-input"
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="Enter your weight in kg"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowWeightDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleLogWeight} disabled={!weightInput} className="flex-1">
                Log Weight
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mood Dialog */}
      <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Log Mood
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mood-select">How are you feeling?</Label>
              <Select value={moodInput} onValueChange={setMoodInput}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your mood">
                    {moodInput && (
                      <span className="flex items-center gap-2">
                        {getMoodEmoji(moodInput)}
                        {moodInput === "1" && "Very Sad"}
                        {moodInput === "2" && "Sad"}
                        {moodInput === "3" && "Neutral"}
                        {moodInput === "4" && "Happy"}
                        {moodInput === "5" && "Very Happy"}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">😢 Very Sad</SelectItem>
                  <SelectItem value="2">😔 Sad</SelectItem>
                  <SelectItem value="3">😐 Neutral</SelectItem>
                  <SelectItem value="4">😊 Happy</SelectItem>
                  <SelectItem value="5">😄 Very Happy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowMoodDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleLogMood} disabled={!moodInput} className="flex-1">
                Log Mood
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Water Dialog */}
      <Dialog open={showWaterDialog} onOpenChange={setShowWaterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Log Water Intake
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="water-input">Amount (liters)</Label>
              <Input
                id="water-input"
                type="number"
                step="0.1"
                value={waterInput}
                onChange={(e) => setWaterInput(e.target.value)}
                placeholder="e.g., 0.5"
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWaterInput("0.25")}
              >
                250ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWaterInput("0.5")}
              >
                500ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWaterInput("0.75")}
              >
                750ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWaterInput("1")}
              >
                1L
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowWaterDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleLogWater} disabled={!waterInput} className="flex-1">
                Log Water
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
