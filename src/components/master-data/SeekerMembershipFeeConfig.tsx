
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, Users, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager, GlobalCacheManager } from '@/utils/dataManager';

interface MembershipFeeEntry {
  id: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
  createdAt: string;
}

// Default data structure
const defaultMembershipFees: MembershipFeeEntry[] = [];

// Data managers for currencies and entity types
const currencyDataManager = new DataManager<any[]>({
  key: 'master_data_currencies',
  defaultData: [],
  version: 1
});

const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: [],
  version: 1
});

const membershipFeeDataManager = new DataManager<MembershipFeeEntry[]>({
  key: 'master_data_seeker_membership_fees',
  defaultData: defaultMembershipFees,
  version: 1
});

GlobalCacheManager.registerKey('master_data_seeker_membership_fees');

const SeekerMembershipFeeConfig = () => {
  const [membershipFees, setMembershipFees] = useState<MembershipFeeEntry[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<MembershipFeeEntry>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadedFees = membershipFeeDataManager.loadData();
    const loadedCurrencies = currencyDataManager.loadData();
    const loadedEntityTypes = entityTypeDataManager.loadData();
    
    setMembershipFees(loadedFees);
    setCurrencies(loadedCurrencies);
    setEntityTypes(loadedEntityTypes);
  }, []);

  // Save data whenever membershipFees change
  useEffect(() => {
    if (membershipFees.length >= 0) {
      membershipFeeDataManager.saveData(membershipFees);
    }
  }, [membershipFees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEntry.entityType || 
        !currentEntry.quarterlyAmount || !currentEntry.quarterlyCurrency ||
        !currentEntry.halfYearlyAmount || !currentEntry.halfYearlyCurrency ||
        !currentEntry.annualAmount || !currentEntry.annualCurrency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if entry already exists for this entity type
    const existingEntry = membershipFees.find(fee => 
      fee.entityType === currentEntry.entityType && fee.id !== currentEntry.id
    );

    if (existingEntry && !isEditing) {
      toast({
        title: "Error",
        description: "Membership fee configuration already exists for this entity type.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentEntry.id) {
      setMembershipFees(prev => prev.map(item => 
        item.id === currentEntry.id ? { ...currentEntry as MembershipFeeEntry } : item
      ));
      toast({
        title: "Success",
        description: "Seeker membership fee updated successfully.",
      });
    } else {
      const newEntry = {
        ...currentEntry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      } as MembershipFeeEntry;
      setMembershipFees(prev => [...prev, newEntry]);
      toast({
        title: "Success",
        description: "Seeker membership fee created successfully.",
      });
    }

    resetForm();
  };

  const handleEdit = (entry: MembershipFeeEntry) => {
    setCurrentEntry(entry);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setMembershipFees(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Seeker membership fee deleted successfully.",
    });
  };

  const resetForm = () => {
    setCurrentEntry({});
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    const defaultData = membershipFeeDataManager.resetToDefault();
    setMembershipFees(defaultData);
    toast({
      title: "Success",
      description: "Seeker membership fees reset to default values.",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    const currencyData = currencies.find(c => c.code === currency);
    const symbol = currencyData?.symbol || currency;
    return `${symbol} ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {isEditing ? 'Edit Seeker Membership Fee' : 'Add Seeker Membership Fee Configuration'}
            </CardTitle>
            <Button
              onClick={handleResetToDefault}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="entityType">Entity Type *</Label>
              <Select
                value={currentEntry.entityType}
                onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, entityType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quarterly Fee */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Quarterly Fee</h3>
                <div>
                  <Label htmlFor="quarterlyCurrency">Currency *</Label>
                  <Select
                    value={currentEntry.quarterlyCurrency}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, quarterlyCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quarterlyAmount">Amount *</Label>
                  <Input
                    id="quarterlyAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentEntry.quarterlyAmount || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, quarterlyAmount: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Half Yearly Fee */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Half Yearly Fee</h3>
                <div>
                  <Label htmlFor="halfYearlyCurrency">Currency *</Label>
                  <Select
                    value={currentEntry.halfYearlyCurrency}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, halfYearlyCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="halfYearlyAmount">Amount *</Label>
                  <Input
                    id="halfYearlyAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentEntry.halfYearlyAmount || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, halfYearlyAmount: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Annual Fee */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Annual Fee</h3>
                <div>
                  <Label htmlFor="annualCurrency">Currency *</Label>
                  <Select
                    value={currentEntry.annualCurrency}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, annualCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="annualAmount">Amount *</Label>
                  <Input
                    id="annualAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentEntry.annualAmount || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, annualAmount: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {isEditing ? 'Update' : 'Submit'} Membership Fee
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
          <CardTitle>Existing Seeker Membership Fee Configurations ({membershipFees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {membershipFees.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No membership fee configurations found. Add one above to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Quarterly</TableHead>
                    <TableHead>Half Yearly</TableHead>
                    <TableHead>Annual</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membershipFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>
                        <Badge variant="outline">{fee.entityType}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(fee.quarterlyAmount, fee.quarterlyCurrency)}</TableCell>
                      <TableCell>{formatCurrency(fee.halfYearlyAmount, fee.halfYearlyCurrency)}</TableCell>
                      <TableCell>{formatCurrency(fee.annualAmount, fee.annualCurrency)}</TableCell>
                      <TableCell>{fee.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(fee)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(fee.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeekerMembershipFeeConfig;
