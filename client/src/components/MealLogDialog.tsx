
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar, Check } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

interface MealLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  mealName: string;
}

export function MealLogDialog({
  isOpen,
  onClose,
  onConfirm,
  mealName,
}: MealLogDialogProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Log Meal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              You are about to log:
            </p>
            <p className="font-semibold">{mealName}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meal-date">Select Date</Label>
            <Input
              id="meal-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Confirm Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
