import React from 'react';
import { PasswordStrength } from '@/types/loginTypes';

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: PasswordStrength;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  passwordStrength,
}) => {
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex space-x-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              passwordStrength.score >= level
                ? passwordStrength.score <= 2
                  ? 'bg-red-400'
                  : passwordStrength.score === 3
                  ? 'bg-yellow-400'
                  : 'bg-green-400'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      {passwordStrength.feedback.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Missing: {passwordStrength.feedback.join(', ')}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;