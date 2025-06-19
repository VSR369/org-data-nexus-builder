
interface MembershipData {
  status: 'active' | 'inactive';
  plan: string;
  activatedAt?: string;
  pricing?: {
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
  private static readonly MEMBER_DISCOUNT = 0.2; // 20% discount

  static getMembershipData(userId: string): MembershipData {
    const data = localStorage.getItem(`${this.MEMBERSHIP_KEY}_${userId}`);
    return data ? JSON.parse(data) : { status: 'inactive', plan: '' };
  }

  static activateMembership(userId: string, plan: string, pricing: any): boolean {
    const membershipData: MembershipData = {
      status: 'active',
      plan,
      activatedAt: new Date().toISOString(),
      pricing
    };
    
    localStorage.setItem(`${this.MEMBERSHIP_KEY}_${userId}`, JSON.stringify(membershipData));
    
    // Auto-adjust existing engagement selection if any
    this.adjustExistingEngagementPricing(userId);
    
    console.log('✅ Membership activated:', membershipData);
    return true;
  }

  static getEngagementSelection(userId: string): EngagementSelection | null {
    const data = localStorage.getItem(`${this.ENGAGEMENT_KEY}_${userId}`);
    const selection = data ? JSON.parse(data) : null;
    console.log('📊 Retrieved engagement selection for user', userId, ':', selection);
    return selection;
  }

  static saveEngagementSelection(userId: string, selection: EngagementSelection): boolean {
    // Apply member discount if user is a member
    const membership = this.getMembershipData(userId);
    if (membership.status === 'active' && !selection.pricing.discountedAmount) {
      selection.pricing.discountedAmount = Math.round(selection.pricing.originalAmount * (1 - this.MEMBER_DISCOUNT));
    }
    
    localStorage.setItem(`${this.ENGAGEMENT_KEY}_${userId}`, JSON.stringify(selection));
    console.log('✅ Engagement selection saved for user', userId, ':', selection);
    return true;
  }

  private static adjustExistingEngagementPricing(userId: string): void {
    const selection = this.getEngagementSelection(userId);
    if (selection && !selection.pricing.discountedAmount) {
      selection.pricing.discountedAmount = Math.round(selection.pricing.originalAmount * (1 - this.MEMBER_DISCOUNT));
      localStorage.setItem(`${this.ENGAGEMENT_KEY}_${userId}`, JSON.stringify(selection));
      console.log('🎯 Auto-adjusted pricing for new member:', selection);
    }
  }
}
