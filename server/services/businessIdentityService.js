const text = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = text(value);
  return words.some((word) => clean.includes(word));
};

export const deriveBusinessIdentity = (profile = {}) => {
  const description = `
    ${profile.businessName || ""}
    ${profile.businessDescription || ""}
    ${profile.businessType || ""}
    ${profile.mainOffer || ""}
  `;

  const identity = {
    businessName: profile.businessName || null,
    businessDescription: profile.businessDescription || profile.businessType || null,
    industry: "General Business",
    businessType: profile.businessType || "General Business",
    mainOffer: profile.mainOffer || null,
  };

  if (hasAny(description, ["barber", "barbing", "haircut", "salon", "grooming"])) {
    return {
      ...identity,
      industry: "Barbering / Grooming",
      businessType: "Barbering / Salon Business",
      mainOffer: profile.mainOffer || "Haircuts and grooming services",
    };
  }

  if (hasAny(description, ["cleaning", "cleaner", "janitorial", "maid"])) {
    return {
      ...identity,
      industry: "Cleaning Services",
      businessType: "Cleaning Business",
      mainOffer: profile.mainOffer || "Residential and commercial cleaning services",
    };
  }

  if (hasAny(description, ["restaurant", "food", "catering", "meal", "kitchen"])) {
    return {
      ...identity,
      industry: "Food / Restaurant",
      businessType: "Food / Restaurant Business",
      mainOffer: profile.mainOffer || "Food, catering, or restaurant services",
    };
  }

  if (hasAny(description, ["clothing", "fashion", "wear", "boutique", "apparel"])) {
    return {
      ...identity,
      industry: "Clothing / Fashion",
      businessType: "Clothing / Fashion Business",
      mainOffer: profile.mainOffer || "Clothing and fashion products",
    };
  }

  if (hasAny(description, ["website", "software", "app", "seo", "automation", "digital"])) {
    return {
      ...identity,
      industry: "Digital Services",
      businessType: "Digital / Technology Service Business",
      mainOffer: profile.mainOffer || "Digital services, websites, SEO, or automation solutions",
    };
  }

  if (hasAny(description, ["consult", "coach", "training", "advisor"])) {
    return {
      ...identity,
      industry: "Professional Services",
      businessType: "Consulting / Professional Service Business",
      mainOffer: profile.mainOffer || "Consulting, coaching, or advisory services",
    };
  }

  return identity;
};

export const getBusinessDisplayName = (profile = {}) => {
  const identity = deriveBusinessIdentity(profile);

  return (
    identity.businessName ||
    identity.businessType ||
    identity.industry ||
    "This business"
  );
};