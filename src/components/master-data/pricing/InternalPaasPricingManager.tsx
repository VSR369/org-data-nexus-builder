
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CountryPricing, PricingConfig } from './types';

interface InternalPaasPricingManagerProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
}

const InternalPaasPricingManager: React.FC<InternalPaasPricingManagerProps> = ({
  currentConfig,
  setCurrentConfig
}) => {
  const [newCountryPricing, setNewCountryPricing] = useState<Partial<CountryPricing>>({});
  const [editingPricingType, setEditingPricingType] = useState<'internal' | null>(null);
  const { toast } = useToast();

  const countries = ['India', 'United States of America', 'United Arab Emirates', 'United Kingdom', 'Germany'];
  const currencies = ['INR', 'USD', 'AED', 'GBP', 'EUR'];

  const handleCountryPricingSubmit = () => {
    if (!newCountryPricing.country || !newCountryPricing.currency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const pricingEntry = {
      ...newCountryPricing,
      id: Date.now().toString(),
    } as CountryPricing;

    setCurrentConfig(prev => ({
      ...prev,
      internalPaasPricing: [...(prev.internalPaasPricing || []), pricingEntry],
    }));

    setNewCountryPricing({});
    setEditingPricingType(null);
    
    toast({
      title: "Success",
      description: "Internal PaaS pricing added successfully.",
    });
  };

  const handleDeleteCountryPricing = (id: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      internalPaasPricing: prev.internalPaasPricing?.filter(item => item.id !== id) || [],
    }));
    
    toast({
      title: "Success",
      description: "Country pricing deleted successfully.",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Internal PaaS Pricing</h3>
          <Button
            type="button"
            onClick={() => setEditingPricingType('internal')}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Country Pricing
          </Button>
        </div>

        {editingPricingType === 'internal' && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <Label>Country *</Label>
                <Select
                  value={newCountryPricing.country}
                  onValueChange={(value) => setNewCountryPricing(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Currency *</Label>
                <Select
                  value={newCountryPricing.currency}
                  onValueChange={(value) => setNewCountryPricing(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quarterly Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCountryPricing.quarterlyPrice || ''}
                  onChange={(e) => setNewCountryPricing(prev => ({ ...prev, quarterlyPrice: parseFloat(e.target.value) }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Half-Yearly Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCountryPricing.halfYearlyPrice || ''}
                  onChange={(e) => setNewCountryPricing(prev => ({ ...prev, halfYearlyPrice: parseFloat(e.target.value) }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Annual Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCountryPricing.annualPrice || ''}
                  onChange={(e) => setNewCountryPricing(prev => ({ ...prev, annualPrice: parseFloat(e.target.value) }))}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCountryPricingSubmit}
                size="sm"
              >
                Add Pricing
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewCountryPricing({});
                  setEditingPricingType(null);
                }}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Quarterly</TableHead>
              <TableHead>Half-Yearly</TableHead>
              <TableHead>Annual</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentConfig.internalPaasPricing?.map((pricing) => (
              <TableRow key={pricing.id}>
                <TableCell>{pricing.country}</TableCell>
                <TableCell>
                  <Badge variant="outline">{pricing.currency}</Badge>
                </TableCell>
                <TableCell>{formatCurrency(pricing.quarterlyPrice, pricing.currency)}</TableCell>
                <TableCell>{formatCurrency(pricing.halfYearlyPrice, pricing.currency)}</TableCell>
                <TableCell>{formatCurrency(pricing.annualPrice, pricing.currency)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCountryPricing(pricing.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InternalPaasPricingManager;
