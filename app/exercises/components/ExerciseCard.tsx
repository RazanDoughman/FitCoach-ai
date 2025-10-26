"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Exercise {
  id: number;
  name: string;
  gifUrl?: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  instructions?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  onSave?: () => void;
  showSaveButton?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

export default function ExerciseCard({
  exercise,
  onClick,
  onSave,
  onRemove,
  showSaveButton = false,
  showRemoveButton = false,
}: ExerciseCardProps) {
  return (
    <Card
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex flex-col justify-between text-gray-900"
      onClick={onClick}
    >
      <img
        src={exercise.gifUrl ||"/static/dumbbell.png"}
        alt={exercise.name}
        className="rounded-md w-full h-40 object-cover"
      />
      <div className="mt-3 text-center">
        <h3 className="text-lg font-semibold">{exercise.name}</h3>
        <p className="text-sm text-gray-500">
          {exercise.target} | {exercise.equipment}
        </p>
      </div>

      {showSaveButton && (
        <Button
          variant="secondary"
          className="mt-3"
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
        >
          Save
        </Button>
      )}

      {showRemoveButton && (
        <Button
          className="mt-3"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          Remove
        </Button>
      )}
    </Card>
  );
}