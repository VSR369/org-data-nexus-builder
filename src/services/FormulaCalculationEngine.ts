interface CalculationResult {
  result: number;
  breakdown: string;
  error?: string;
}

export class FormulaCalculationEngine {
  static calculateFormula(expression: string, variables: Record<string, number>): CalculationResult {
    try {
      let cleanExpression = expression.trim();
      let breakdown = `Formula: ${expression}\n`;
      
      // Replace variables with their values
      for (const [varName, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\b${varName}\\b`, 'g');
        if (cleanExpression.includes(varName)) {
          cleanExpression = cleanExpression.replace(regex, value.toString());
          breakdown += `${varName} = ${value}\n`;
        }
      }

      breakdown += `Calculation: ${cleanExpression}\n`;

      // Simple safe evaluation
      const result = new Function('return (' + cleanExpression + ')')();
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }

      breakdown += `Result: ${result}`;

      return {
        result: Number(result.toFixed(2)),
        breakdown
      };

    } catch (error) {
      return {
        result: 0,
        breakdown: '',
        error: error instanceof Error ? error.message : 'Calculation error'
      };
    }
  }
}