
interface EntityType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface MembershipPlan {
  id: string;
  name: string;
  fee: number;
  currency: string;
  entityTypeId: string;
  duration: 'quarterly' | 'halfYearly' | 'annual';
  createdAt: string;
  updatedAt: string;
}

class EntityTypeManager {
  private static readonly ENTITY_TYPES_KEY = 'entity_types';
  private static readonly MEMBERSHIP_PLANS_KEY = 'membership_plans';

  // Entity Types CRUD
  static getAllEntityTypes(): EntityType[] {
    try {
      const data = localStorage.getItem(this.ENTITY_TYPES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading entity types:', error);
      return [];
    }
  }

  static saveEntityType(entityType: Omit<EntityType, 'id' | 'createdAt' | 'updatedAt'>): EntityType {
    const entityTypes = this.getAllEntityTypes();
    const newEntityType: EntityType = {
      ...entityType,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    entityTypes.push(newEntityType);
    localStorage.setItem(this.ENTITY_TYPES_KEY, JSON.stringify(entityTypes));
    console.log('✅ Entity type saved:', newEntityType);
    return newEntityType;
  }

  static updateEntityType(id: string, updates: Partial<Omit<EntityType, 'id' | 'createdAt'>>): EntityType | null {
    const entityTypes = this.getAllEntityTypes();
    const index = entityTypes.findIndex(et => et.id === id);
    
    if (index === -1) return null;
    
    entityTypes[index] = {
      ...entityTypes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.ENTITY_TYPES_KEY, JSON.stringify(entityTypes));
    console.log('✅ Entity type updated:', entityTypes[index]);
    return entityTypes[index];
  }

  static deleteEntityType(id: string): boolean {
    const entityTypes = this.getAllEntityTypes();
    const filteredTypes = entityTypes.filter(et => et.id !== id);
    
    if (filteredTypes.length === entityTypes.length) return false;
    
    // Also delete associated membership plans
    const membershipPlans = this.getAllMembershipPlans();
    const filteredPlans = membershipPlans.filter(mp => mp.entityTypeId !== id);
    
    localStorage.setItem(this.ENTITY_TYPES_KEY, JSON.stringify(filteredTypes));
    localStorage.setItem(this.MEMBERSHIP_PLANS_KEY, JSON.stringify(filteredPlans));
    console.log('✅ Entity type and associated plans deleted:', id);
    return true;
  }

  // Membership Plans CRUD
  static getAllMembershipPlans(): MembershipPlan[] {
    try {
      const data = localStorage.getItem(this.MEMBERSHIP_PLANS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading membership plans:', error);
      return [];
    }
  }

  static saveMembershipPlan(plan: Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt'>): MembershipPlan {
    const plans = this.getAllMembershipPlans();
    const newPlan: MembershipPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    plans.push(newPlan);
    localStorage.setItem(this.MEMBERSHIP_PLANS_KEY, JSON.stringify(plans));
    console.log('✅ Membership plan saved:', newPlan);
    return newPlan;
  }

  static updateMembershipPlan(id: string, updates: Partial<Omit<MembershipPlan, 'id' | 'createdAt'>>): MembershipPlan | null {
    const plans = this.getAllMembershipPlans();
    const index = plans.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    plans[index] = {
      ...plans[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.MEMBERSHIP_PLANS_KEY, JSON.stringify(plans));
    console.log('✅ Membership plan updated:', plans[index]);
    return plans[index];
  }

  static deleteMembershipPlan(id: string): boolean {
    const plans = this.getAllMembershipPlans();
    const filteredPlans = plans.filter(p => p.id !== id);
    
    if (filteredPlans.length === plans.length) return false;
    
    localStorage.setItem(this.MEMBERSHIP_PLANS_KEY, JSON.stringify(filteredPlans));
    console.log('✅ Membership plan deleted:', id);
    return true;
  }

  // Utility methods
  static getMembershipPlansByEntityType(entityTypeId: string): MembershipPlan[] {
    return this.getAllMembershipPlans().filter(plan => plan.entityTypeId === entityTypeId);
  }

  static getEntityTypeById(id: string): EntityType | null {
    return this.getAllEntityTypes().find(et => et.id === id) || null;
  }

  static getMembershipPlanById(id: string): MembershipPlan | null {
    return this.getAllMembershipPlans().find(p => p.id === id) || null;
  }

  // Demo data seeding
  static seedDemoData(): void {
    console.log('🌱 Seeding demo data...');
    
    // Clear existing data
    localStorage.removeItem(this.ENTITY_TYPES_KEY);
    localStorage.removeItem(this.MEMBERSHIP_PLANS_KEY);
    
    // Add entity types
    const commercial = this.saveEntityType({ name: 'Commercial' });
    const nonprofit = this.saveEntityType({ name: 'Non-Profit Organization' });
    const society = this.saveEntityType({ name: 'Society/Trust' });
    
    // Add membership plans
    this.saveMembershipPlan({
      name: 'Commercial Quarterly',
      fee: 199,
      currency: 'USD',
      entityTypeId: commercial.id,
      duration: 'quarterly'
    });
    
    this.saveMembershipPlan({
      name: 'Commercial Annual',
      fee: 719,
      currency: 'USD',
      entityTypeId: commercial.id,
      duration: 'annual'
    });
    
    this.saveMembershipPlan({
      name: 'Non-Profit Quarterly',
      fee: 49,
      currency: 'USD',
      entityTypeId: nonprofit.id,
      duration: 'quarterly'
    });
    
    this.saveMembershipPlan({
      name: 'Society Annual',
      fee: 359,
      currency: 'USD',
      entityTypeId: society.id,
      duration: 'annual'
    });
    
    console.log('✅ Demo data seeded successfully');
  }
}

export { EntityTypeManager };
export type { EntityType, MembershipPlan };
