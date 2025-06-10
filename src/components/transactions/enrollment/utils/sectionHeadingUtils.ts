
export const getSectionHeading = (providerRoles?: string[]) => {
  const currentRoles = providerRoles || [];
  const hasProvider = currentRoles.includes('solution-provider');
  const hasAssessor = currentRoles.includes('solution-assessor');
  const hasBoth = currentRoles.includes('both') || (hasProvider && hasAssessor);

  if (hasBoth) {
    return "Provider & Assessor Both Roles Information";
  } else if (hasAssessor) {
    return "Assessor Information";
  } else if (hasProvider) {
    return "Provider Information";
  } else {
    return "Provider Information"; // Default heading
  }
};
