
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { organizationTypesDataManager } from '@/utils/sharedDataManagers';

interface CountryPricing {
  id: string;
  country: string;
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
}

interface PricingConfig {
  id: string;
  organizationType: string;
  marketplaceFee: number;
  aggregatorFee: number;
  marketplacePlusAggregatorFee: number;
  internalPaasPricing: CountryPricing[];
  version: number;
  createdAt: string;
}

const PricingConfig = () => {
  const [configs, setConfigs] = useState<PricingConfig[]>([
    {
      id: '1',
      organizationType: 'All Organizations',
      marketplaceFee: 30,
      aggregatorFee: 15,
      marketplacePlusAggregatorFee: 45,
      internalPaasPricing: [
        { id: '1', country: 'India', currency: 'INR', quarterlyPrice: 50000, halfYearlyPrice: 90000, annualPrice: 150000 },
        { id: '2', country: 'United States of America', currency: 'USD', quarterlyPrice: 600, halfYearlyPrice: 1080, annualPrice: 1800 },
      ],
      version: 1,
      createdAt: '2024-01-01',
    },
  ]);

  const [currentConfig, setCurrentConfig] = useState<Partial<PricingConfig>>({
    organizationType: 'All Organizations',
    marketplaceFee: 30,
    aggregatorFee: 15,
    marketplacePlusAggregatorFee: 45,
    internalPaasPricing: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [newCountryPricing, setNewCountryPricing] = useState<Partial<CountryPricing>>({});
  const [editingPricingType, setEditingPricingType] = useState<'internal' | null>(null);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);

  const { toast } = useToast();

  // Load organization types from master data
  useEffect(() => {
    console.log('🔄 PricingConfig: Loading organization types from master data...');
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    console.log('✅ PricingConfig: Loaded organization types:', loadedOrgTypes);
    setOrganizationTypes(loadedOrgTypes);
  }, []);

  const countries = ['India', 'United States of America', 'United Arab Emirates', 'United Kingdom', 'Germany'];
  const currencies = ['INR', 'USD', 'AED', 'GBP', 'EUR'];

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentConfig.organizationType) {
      toast({
        title: "Error",
        description: "Please select an organization type.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentConfig.id) {
      setConfigs(prev => prev.map(item => 
        item.id === currentConfig.id 
          ? { ...currentConfig as PricingConfig, version: item.version + 1 }
          : item
      ));
      toast({
        title: "Success",
        description: "Pricing configuration updated successfully.",
      });
    } else {
      const newConfig = {
        ...currentConfig,
        id: Date.now().toString(),
        version: 1,
        createdAt: new Date().toISOString().split('T')[0],
      } as PricingConfig;
      setConfigs(prev => [...prev, newConfig]);
      toast({
        title: "Success",
        description: "Pricing configuration created successfully.",
      });
    }

    resetForm();
  };

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

  const handleEdit = (config: PricingConfig) => {
    setCurrentConfig(config);
    setIsEditing(true);
    setActiveTab('general');
  };

  const handleDelete = (id: string) => {
    setConfigs(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Pricing configuration deleted successfully.",
    });
  };

  const resetForm = () => {
    setCurrentConfig({
      organizationType: 'All Organizations',
      marketplaceFee: 30,
      aggregatorFee: 15,
      marketplacePlusAggregatorFee: 45,
      internalPaasPricing: [],
    });
    setIsEditing(false);
    setActiveTab('general');
    setNewCountryPricing({});
    setEditingPricingType(null);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {isEditing ? 'Edit Pricing Configuration' : 'Add New Pricing Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            {['general', 'internal-paas'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'general' && 'General Config'}
                {tab === 'internal-paas' && 'Internal PaaS'}
              </button>
            ))}
          </div>

          <form onSubmit={handleConfigSubmit}>
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select
                      value={currentConfig.organizationType}
                      onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, organizationType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="marketplaceFee">Marketplace Fee (%) *</Label>
                    <Input
                      id="marketplaceFee"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={currentConfig.marketplaceFee || ''}
                      onChange={(e) => setCurrentConfig(prev => ({ ...prev, marketplaceFee: parseFloat(e.target.value) }))}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aggregatorFee">Aggregator Fee (%) *</Label>
                    <Input
                      id="aggregatorFee"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={currentConfig.aggregatorFee || ''}
                      onChange={(e) => setCurrentConfig(prev => ({ ...prev, aggregatorFee: parseFloat(e.target.value) }))}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marketplacePlusAggregatorFee">Marketplace Plus Aggregator (%) *</Label>
                    <Input
                      id="marketplacePlusAggregatorFee"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={currentConfig.marketplacePlusAggregatorFee || ''}
                      onChange={(e) => setCurrentConfig(prev => ({ ...prev, marketplacePlusAggregatorFee: parseFloat(e.target.value) }))}
                      placeholder="45"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'internal-paas' && (
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
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {isEditing ? 'Update' : 'Create'} Configuration
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Pricing Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {configs.map((config) => (
              <div key={config.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{config.organizationType}</h3>
                    <p className="text-sm text-muted-foreground">
                      Version {config.version} • Created: {config.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(config)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(config.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Marketplace Fee:</span>
                    <p>{config.marketplaceFee}%</p>
                  </div>
                  <div>
                    <span className="font-medium">Aggregator Fee:</span>
                    <p>{config.aggregatorFee}%</p>
                  </div>
                  <div>
                    <span className="font-medium">Marketplace Plus Aggregator:</span>
                    <p>{config.marketplacePlusAggregatorFee}%</p>
                  </div>
                  <div>
                    <span className="font-medium">Internal PaaS Countries:</span>
                    <p>{config.internalPaasPricing.length}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingConfig;
