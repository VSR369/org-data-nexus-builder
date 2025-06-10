
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface RatingSliderProps {
  subCategoryName: string;
  description?: string;
  currentRating: number;
  onRatingChange: (rating: number) => void;
}

// Helper function to get rating description based on value
const getRatingDescription = (rating: number) => {
  if (rating >= 0 && rating < 2.5) return "No Competency";
  if (rating >= 2.5 && rating < 5) return "Basic";
  if (rating >= 5 && rating < 7.5) return "Advanced";
  if (rating >= 7.5 && rating <= 10) return "Guru";
  return "";
};

// Helper function to get rating color based on value
const getRatingColor = (rating: number) => {
  if (rating >= 0 && rating < 2.5) return "text-red-600";
  if (rating >= 2.5 && rating < 5) return "text-yellow-600";
  if (rating >= 5 && rating < 7.5) return "text-blue-600";
  if (rating >= 7.5 && rating <= 10) return "text-green-600";
  return "text-gray-600";
};

const RatingSlider: React.FC<RatingSliderProps> = ({
  currentRating,
  onRatingChange
}) => {
  const ratingDescription = getRatingDescription(currentRating);
  const ratingColor = getRatingColor(currentRating);

  return (
    <div className="space-y-3 mt-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Competency Rating:</span>
        <div className="text-right">
          <div className="text-lg font-bold">{currentRating}/10</div>
          <div className={`text-xs font-medium ${ratingColor}`}>
            {ratingDescription}
          </div>
        </div>
      </div>
      <Slider
        value={[currentRating]}
        onValueChange={([value]) => onRatingChange(value)}
        max={10}
        min={0}
        step={0.5}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 - No Competency</span>
        <span>2.5 - Basic</span>
        <span>5 - Advanced</span>
        <span>7.5+ - Guru</span>
      </div>
    </div>
  );
};

export default RatingSlider;
