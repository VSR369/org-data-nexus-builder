
export interface CompetencyData {
  [industrySegment: string]: {
    [domainGroup: string]: {
      [category: string]: {
        [subCategory: string]: number;
      };
    };
  };
}

export interface CompetencySummary {
  noCompetency: number;
  basic: number;
  advanced: number;
  guru: number;
}
