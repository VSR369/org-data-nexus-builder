
interface MembershipData {
  status: 'active' | 'inactive';
  plan: string;
  activatedAt?: string;
  pricingDetails?: {
    currency: string;
    amount: number;
    frequency: string;
  };
}

interface EngagementSelection {
  model: string;
  duration: string;
  pricing: {
    currency: string;
    originalAmount: number;
    discountedAmount?: number;
    frequency: string;
  };
  selectedAt: string;
}

export class MembershipService {
  private static readonly MEMBERSHIP_KEY = 'user_membership_data';
  private static readonly ENGAGEMENT_KEY = 'user_engagement_selection';

  static getMembershipData(userId: string): MembershipData {
    try {
      const data = localStorage.getItem(`${this.MEMBERSHIP_KEY}_${userId}`);
      return data ? JSON.parse(data) : { status: 'inactive', plan: '' };
    } catch (error) {
      console.error('Error loading membership data:', error);
      return { status: 'inactive', plan: '' };
    }
  }

  static saveMembershipData(userId: string, membershipData: MembershipData): boolean {
    try {
      localStorage.setItem(`${this.MEMBERSHIP_KEY}_${userId}`, JSON.stringify(membershipData));
      console.log('✅ Membership data saved:', membershipData);
      return true;
    } catch (error) {
      console.error('❌ Error saving membership data:', error);
      return false;
    }
  }

  static activateMembership(userId: string, plan: string, pricing: any): boolean {
    const membershipData: MembershipData = {
      status: 'active',
      plan,
      activatedAt: new Date().toISOString(),
      pricingDetails: pricing
    };
    return this.saveMembershipData(userId, membershipData);
  }

  static getEngagementSelection(userId: string): EngagementSelection | null {
    try {
      const data = localStorage.getItem(`${this.ENGAGEMENT_KEY}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading engagement selection:', error);
      return null;
    }
  }

  static saveEngagementSelection(userId: string, selection: EngagementSelection): boolean {
    try {
      localStorage.setItem(`${this.ENGAGEMENT_KEY}_${userId}`, JSON.stringify(selection));
      
      // Auto-adjust pricing if user became a member after initial selection
      const membership = this.getMembershipData(userId);
      if (membership.status === 'active' && selection.pricing.discountedAmount === undefined) {
        this.autoAdjustPricing(userId, selection);
      }
      
      console.log('✅ Engagement selection saved:', selection);
      return true;
    } catch (error) {
      console.error('❌ Error saving engagement selection:', error);
      return false;
    }
  }

  private static autoAdjustPricing(userId: string, selection: EngagementSelection): void {
    // Apply 20% member discount
    const discountedAmount = Math.round(selection.pricing.originalAmount * 0.8);
    const updatedSelection = {
      ...selection,
      pricing: {
        ...selection.pricing,
        discountedAmount
      }
    };
    
    localStorage.setItem(`${this.ENGAGEMENT_KEY}_${userId}`, JSON.stringify(updatedSelection));
    console.log('🎯 Auto-adjusted pricing for member:', updatedSelection);
  }
}
