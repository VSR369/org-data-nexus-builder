
import React from 'react';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ColorOption } from './types';

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  colorOptions: ColorOption[];
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorChange,
  colorOptions,
}) => {
  return (
    <div>
      <Label>Color Theme</Label>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`p-2 rounded border-2 ${
              selectedColor === color.value ? 'ring-2 ring-primary' : ''
            }`}
          >
            <Badge className={color.value}>{color.label}</Badge>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
