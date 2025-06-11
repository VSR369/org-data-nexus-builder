
export const getSectionHeading = (providerRoles?: string[]) => {
  const currentRoles = providerRoles || [];
  const hasProvider = currentRoles.includes('solution-provider');
  const hasAssessor = currentRoles.includes('solution-assessor');
  const hasBoth = currentRoles.includes('both') || (hasProvider && hasAssessor);

  if (hasBoth) {
    return "Solution Provider & Assessor Details";
  } else if (hasAssessor) {
    return "Assessor Details";
  } else if (hasProvider) {
    return "Solution Provider Details";
  } else {
    return "Contributor Details"; // Default heading when no role is selected
  }
};
