import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';

interface TierEngagementRestrictionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restriction?: any;
  onSave: (data: any) => void;
  loading?: boolean;
}

export const TierEngagementRestrictionDialog: React.FC<TierEngagementRestrictionDialogProps> = ({
  open,
  onOpenChange,
  restriction,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    pricing_tier_id: '',
    engagement_model_id: '',
    engagement_model_subtype_id: '',
    is_allowed: true,
  });

  const { items: pricingTiers } = useMasterDataCRUD('master_pricing_tiers');
  const { items: engagementModels } = useMasterDataCRUD('master_engagement_models');
  const { items: engagementSubtypes } = useMasterDataCRUD('master_engagement_model_subtypes');

  // Filter subtypes based on selected engagement model
  const filteredSubtypes = engagementSubtypes.filter(
    (subtype: any) => subtype.engagement_model_id === formData.engagement_model_id
  );

  useEffect(() => {
    if (restriction) {
      setFormData({
        pricing_tier_id: restriction.pricing_tier_id || '',
        engagement_model_id: restriction.engagement_model_id || '',
        engagement_model_subtype_id: restriction.engagement_model_subtype_id || '',
        is_allowed: restriction.is_allowed !== false,
      });
    } else {
      setFormData({
        pricing_tier_id: '',
        engagement_model_id: '',
        engagement_model_subtype_id: '',
        is_allowed: true,
      });
    }
  }, [restriction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If no subtype is selected, set it to null for "all subtypes"
    const submitData = {
      ...formData,
      engagement_model_subtype_id: formData.engagement_model_subtype_id || null,
    };
    
    onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {restriction ? 'Edit' : 'Add'} Tier Engagement Restriction
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pricing_tier">Pricing Tier *</Label>
            <Select
              value={formData.pricing_tier_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_tier_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pricing tier" />
              </SelectTrigger>
              <SelectContent>
                {pricingTiers.map((tier: any) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.name} (Level {tier.level_order})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engagement_model">Engagement Model *</Label>
            <Select
              value={formData.engagement_model_id}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                engagement_model_id: value,
                engagement_model_subtype_id: '' // Reset subtype when model changes
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select engagement model" />
              </SelectTrigger>
              <SelectContent>
                {engagementModels.map((model: any) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engagement_subtype">Engagement Model Subtype</Label>
            <Select
              value={formData.engagement_model_subtype_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, engagement_model_subtype_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subtype (optional - leave empty for all)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subtypes</SelectItem>
                {filteredSubtypes.map((subtype: any) => (
                  <SelectItem key={subtype.id} value={subtype.id}>
                    {subtype.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave empty to apply to all subtypes of the selected engagement model
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_allowed"
              checked={formData.is_allowed}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_allowed: checked }))}
            />
            <Label htmlFor="is_allowed">
              {formData.is_allowed ? 'Allow Access' : 'Restrict Access'}
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};