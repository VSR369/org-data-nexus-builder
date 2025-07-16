export class FormulaCalculationEngine {
  /**
   * Evaluates a mathematical formula with given variables
   * @param formula - The formula string (e.g., "base_value * country_multiplier + fixed_fee")
   * @param variables - Object containing variable values
   * @returns The calculated result
   */
  static evaluate(formula: string, variables: Record<string, any>): number {
    try {
      // Replace variables in the formula with their values
      let processedFormula = formula;
      
      for (const [varName, varValue] of Object.entries(variables)) {
        const numericValue = this.toNumber(varValue);
        // Use word boundaries to ensure we don't replace partial matches
        const regex = new RegExp(`\\b${varName}\\b`, 'g');
        processedFormula = processedFormula.replace(regex, numericValue.toString());
      }

      // Validate that only allowed characters remain
      if (!this.isValidExpression(processedFormula)) {
        throw new Error('Invalid characters in formula expression');
      }

      // Evaluate the mathematical expression safely
      return this.safeEval(processedFormula);
    } catch (error) {
      console.error('Formula evaluation error:', error);
      throw new Error(`Failed to evaluate formula: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Converts a value to a number, handling various input types
   */
  private static toNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) throw new Error(`Cannot convert "${value}" to number`);
      return parsed;
    }
    if (typeof value === 'boolean') return value ? 1 : 0;
    throw new Error(`Cannot convert ${typeof value} to number`);
  }

  /**
   * Validates that the expression contains only allowed mathematical characters
   */
  private static isValidExpression(expression: string): boolean {
    // Allow numbers, basic operators, parentheses, and whitespace
    const allowedPattern = /^[0-9+\-*/.() \t\n]+$/;
    return allowedPattern.test(expression);
  }

  /**
   * Safely evaluates a mathematical expression without using eval()
   * This is a simple implementation - in production, consider using a proper math parser
   */
  private static safeEval(expression: string): number {
    // Remove whitespace
    const cleaned = expression.replace(/\s+/g, '');
    
    try {
      // Use Function constructor for safer evaluation than eval()
      // This still has security considerations but is safer than direct eval
      const func = new Function('return ' + cleaned);
      const result = func();
      
      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Expression did not evaluate to a valid number');
      }
      
      return result;
    } catch (error) {
      throw new Error(`Expression evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates that all required variables are provided for a formula
   */
  static validateVariables(formula: string, variables: Record<string, any>): { isValid: boolean; missingVariables: string[] } {
    // Extract variable names from formula (simple regex-based approach)
    const variablePattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const foundVariables = formula.match(variablePattern) || [];
    
    // Filter out mathematical functions and operators
    const mathFunctions = ['sin', 'cos', 'tan', 'log', 'sqrt', 'abs', 'min', 'max'];
    const variableNames = foundVariables.filter(v => !mathFunctions.includes(v.toLowerCase()));
    
    // Remove duplicates
    const uniqueVariables = [...new Set(variableNames)];
    
    // Check which variables are missing
    const missingVariables = uniqueVariables.filter(varName => !(varName in variables));
    
    return {
      isValid: missingVariables.length === 0,
      missingVariables
    };
  }

  /**
   * Gets default variables for common formula calculations
   */
  static getDefaultVariables(): Record<string, any> {
    return {
      base_value: 0,
      country_multiplier: 1,
      currency_rate: 1,
      tier_discount: 0,
      membership_discount: 0,
      fixed_fee: 0,
      percentage_fee: 0,
      minimum_fee: 0,
      maximum_fee: Number.MAX_SAFE_INTEGER,
    };
  }

  /**
   * Calculates platform fee using formula with fallback to base calculation
   */
  static calculatePlatformFee(
    baseValue: number,
    formula?: string,
    formulaVariables?: Record<string, any>
  ): number {
    if (!formula) {
      // Fallback to simple percentage calculation
      return baseValue * 0.1; // 10% default
    }

    const variables = {
      ...this.getDefaultVariables(),
      base_value: baseValue,
      ...formulaVariables,
    };

    return this.evaluate(formula, variables);
  }

  /**
   * Calculates advance payment based on platform fee percentage
   */
  static calculateAdvancePayment(
    platformFee: number,
    advancePercentage: number
  ): number {
    if (advancePercentage < 0 || advancePercentage > 100) {
      throw new Error('Advance percentage must be between 0 and 100');
    }
    
    return platformFee * (advancePercentage / 100);
  }
}