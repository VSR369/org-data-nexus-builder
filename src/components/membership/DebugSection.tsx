
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DebugSectionProps {
  debugInfo: string[];
}

export const DebugSection = ({ debugInfo }: DebugSectionProps) => {
  if (debugInfo.length === 0) {
    return null;
  }

  return (
    <Card className="bg-yellow-50 border border-yellow-200">
      <CardHeader>
        <CardTitle className="text-lg text-yellow-800">Debug Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-yellow-700 space-y-2">
          {debugInfo.map((info, index) => (
            <div key={index} className="font-mono bg-yellow-100 p-2 rounded">
              {info}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
