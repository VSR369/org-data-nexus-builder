
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProviderIdSectionProps {
  providerId: string;
}

const ProviderIdSection: React.FC<ProviderIdSectionProps> = ({ providerId }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(providerId);
    toast({
      title: "Copied",
      description: "Provider ID copied to clipboard",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Solution Provider ID
          <Badge variant="secondary">Auto-generated</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This unique identifier prevents duplicate registrations and helps track your enrollment.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="provider-id" className="sr-only">Provider ID</Label>
            <Input 
              id="provider-id" 
              value={providerId}
              readOnly
              className="font-mono bg-muted"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            title="Copy Provider ID"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderIdSection;
