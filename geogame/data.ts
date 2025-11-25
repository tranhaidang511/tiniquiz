export interface Country {
  code: string;
  regions: string[];
  continent: string;
}

export const countries: Country[] = [
  // Africa - Northern
  { code: "DZ", regions: ["Northern Africa"], continent: "Africa" },
  { code: "EG", regions: ["Northern Africa"], continent: "Africa" },
  { code: "LY", regions: ["Northern Africa"], continent: "Africa" },
  { code: "MA", regions: ["Northern Africa"], continent: "Africa" },
  { code: "SD", regions: ["Northern Africa"], continent: "Africa" },
  { code: "TN", regions: ["Northern Africa"], continent: "Africa" },

  // Africa - Eastern
  { code: "BI", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "KM", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "DJ", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "ER", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "ET", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "KE", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "MG", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "MW", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "MU", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "MZ", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "RW", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "SC", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "SO", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "SS", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "UG", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "TZ", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "ZM", regions: ["Eastern Africa"], continent: "Africa" },
  { code: "ZW", regions: ["Eastern Africa"], continent: "Africa" },

  // Africa - Middle
  { code: "AO", regions: ["Middle Africa"], continent: "Africa" },
  { code: "CM", regions: ["Middle Africa"], continent: "Africa" },
  { code: "CF", regions: ["Middle Africa"], continent: "Africa" },
  { code: "TD", regions: ["Middle Africa"], continent: "Africa" },
  { code: "CG", regions: ["Middle Africa"], continent: "Africa" },
  { code: "CD", regions: ["Middle Africa"], continent: "Africa" },
  { code: "GQ", regions: ["Middle Africa"], continent: "Africa" },
  { code: "GA", regions: ["Middle Africa"], continent: "Africa" },
  { code: "ST", regions: ["Middle Africa"], continent: "Africa" },

  // Africa - Southern
  { code: "BW", regions: ["Southern Africa"], continent: "Africa" },
  { code: "SZ", regions: ["Southern Africa"], continent: "Africa" },
  { code: "LS", regions: ["Southern Africa"], continent: "Africa" },
  { code: "NA", regions: ["Southern Africa"], continent: "Africa" },
  { code: "ZA", regions: ["Southern Africa"], continent: "Africa" },

  // Africa - Western
  { code: "BJ", regions: ["Western Africa"], continent: "Africa" },
  { code: "BF", regions: ["Western Africa"], continent: "Africa" },
  { code: "CV", regions: ["Western Africa"], continent: "Africa" },
  { code: "CI", regions: ["Western Africa"], continent: "Africa" },
  { code: "GM", regions: ["Western Africa"], continent: "Africa" },
  { code: "GH", regions: ["Western Africa"], continent: "Africa" },
  { code: "GN", regions: ["Western Africa"], continent: "Africa" },
  { code: "GW", regions: ["Western Africa"], continent: "Africa" },
  { code: "LR", regions: ["Western Africa"], continent: "Africa" },
  { code: "ML", regions: ["Western Africa"], continent: "Africa" },
  { code: "MR", regions: ["Western Africa"], continent: "Africa" },
  { code: "NE", regions: ["Western Africa"], continent: "Africa" },
  { code: "NG", regions: ["Western Africa"], continent: "Africa" },
  { code: "SN", regions: ["Western Africa"], continent: "Africa" },
  { code: "SL", regions: ["Western Africa"], continent: "Africa" },
  { code: "TG", regions: ["Western Africa"], continent: "Africa" },

  // Americas - Northern
  { code: "CA", regions: ["Northern America"], continent: "Americas" },
  { code: "US", regions: ["Northern America"], continent: "Americas" },

  // Americas - Caribbean
  { code: "AG", regions: ["Caribbean"], continent: "Americas" },
  { code: "BS", regions: ["Caribbean"], continent: "Americas" },
  { code: "BB", regions: ["Caribbean"], continent: "Americas" },
  { code: "CU", regions: ["Caribbean"], continent: "Americas" },
  { code: "DM", regions: ["Caribbean"], continent: "Americas" },
  { code: "DO", regions: ["Caribbean"], continent: "Americas" },
  { code: "GD", regions: ["Caribbean"], continent: "Americas" },
  { code: "HT", regions: ["Caribbean"], continent: "Americas" },
  { code: "JM", regions: ["Caribbean"], continent: "Americas" },
  { code: "KN", regions: ["Caribbean"], continent: "Americas" },
  { code: "LC", regions: ["Caribbean"], continent: "Americas" },
  { code: "VC", regions: ["Caribbean"], continent: "Americas" },
  { code: "TT", regions: ["Caribbean"], continent: "Americas" },

  // Americas - Central
  { code: "BZ", regions: ["Central America"], continent: "Americas" },
  { code: "CR", regions: ["Central America"], continent: "Americas" },
  { code: "SV", regions: ["Central America"], continent: "Americas" },
  { code: "GT", regions: ["Central America"], continent: "Americas" },
  { code: "HN", regions: ["Central America"], continent: "Americas" },
  { code: "MX", regions: ["Central America"], continent: "Americas" },
  { code: "NI", regions: ["Central America"], continent: "Americas" },
  { code: "PA", regions: ["Central America"], continent: "Americas" },

  // Americas - South
  { code: "AR", regions: ["South America"], continent: "Americas" },
  { code: "BO", regions: ["South America"], continent: "Americas" },
  { code: "BR", regions: ["South America"], continent: "Americas" },
  { code: "CL", regions: ["South America"], continent: "Americas" },
  { code: "CO", regions: ["South America"], continent: "Americas" },
  { code: "EC", regions: ["South America"], continent: "Americas" },
  { code: "GY", regions: ["South America"], continent: "Americas" },
  { code: "PY", regions: ["South America"], continent: "Americas" },
  { code: "PE", regions: ["South America"], continent: "Americas" },
  { code: "SR", regions: ["South America"], continent: "Americas" },
  { code: "UY", regions: ["South America"], continent: "Americas" },
  { code: "VE", regions: ["South America"], continent: "Americas" },

  // Asia - Central
  { code: "KZ", regions: ["Central Asia"], continent: "Asia" },
  { code: "KG", regions: ["Central Asia"], continent: "Asia" },
  { code: "TJ", regions: ["Central Asia"], continent: "Asia" },
  { code: "TM", regions: ["Central Asia"], continent: "Asia" },
  { code: "UZ", regions: ["Central Asia"], continent: "Asia" },

  // Asia - East
  { code: "CN", regions: ["East Asia"], continent: "Asia" },
  { code: "JP", regions: ["East Asia"], continent: "Asia" },
  { code: "MN", regions: ["East Asia"], continent: "Asia" },
  { code: "KP", regions: ["East Asia"], continent: "Asia" },
  { code: "KR", regions: ["East Asia"], continent: "Asia" },

  // Asia - Southeast
  { code: "BN", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "KH", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "ID", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "LA", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "MY", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "MM", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "PH", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "SG", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "TH", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "TL", regions: ["Southeast Asia"], continent: "Asia" },
  { code: "VN", regions: ["Southeast Asia"], continent: "Asia" },

  // Asia - South
  { code: "AF", regions: ["South Asia"], continent: "Asia" },
  { code: "BD", regions: ["South Asia"], continent: "Asia" },
  { code: "BT", regions: ["South Asia"], continent: "Asia" },
  { code: "IN", regions: ["South Asia"], continent: "Asia" },
  { code: "MV", regions: ["South Asia"], continent: "Asia" },
  { code: "NP", regions: ["South Asia"], continent: "Asia" },
  { code: "PK", regions: ["South Asia"], continent: "Asia" },
  { code: "LK", regions: ["South Asia"], continent: "Asia" },

  // Asia - West
  { code: "IR", regions: ["West Asia"], continent: "Asia" },
  { code: "AM", regions: ["West Asia"], continent: "Asia" },
  { code: "AZ", regions: ["West Asia"], continent: "Asia" },
  { code: "BH", regions: ["West Asia"], continent: "Asia" },
  { code: "CY", regions: ["West Asia"], continent: "Asia" },
  { code: "GE", regions: ["West Asia"], continent: "Asia" },
  { code: "IQ", regions: ["West Asia"], continent: "Asia" },
  { code: "IL", regions: ["West Asia"], continent: "Asia" },
  { code: "JO", regions: ["West Asia"], continent: "Asia" },
  { code: "KW", regions: ["West Asia"], continent: "Asia" },
  { code: "LB", regions: ["West Asia"], continent: "Asia" },
  { code: "OM", regions: ["West Asia"], continent: "Asia" },
  { code: "QA", regions: ["West Asia"], continent: "Asia" },
  { code: "SA", regions: ["West Asia"], continent: "Asia" },
  { code: "SY", regions: ["West Asia"], continent: "Asia" },
  { code: "TR", regions: ["West Asia"], continent: "Asia" },
  { code: "AE", regions: ["West Asia"], continent: "Asia" },
  { code: "YE", regions: ["West Asia"], continent: "Asia" },

  // Europe - Eastern
  { code: "BY", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "BG", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "CZ", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "HU", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "PL", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "MD", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "RO", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "RU", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "SK", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "UA", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "EE", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "LV", regions: ["Eastern Europe"], continent: "Europe" },
  { code: "LT", regions: ["Eastern Europe"], continent: "Europe" },

  // Europe - Northern
  { code: "DK", regions: ["Northern Europe"], continent: "Europe" },
  { code: "FI", regions: ["Northern Europe"], continent: "Europe" },
  { code: "IS", regions: ["Northern Europe"], continent: "Europe" },
  { code: "IE", regions: ["Northern Europe"], continent: "Europe" },
  { code: "NO", regions: ["Northern Europe"], continent: "Europe" },
  { code: "SE", regions: ["Northern Europe"], continent: "Europe" },

  // Europe - Southern
  { code: "AL", regions: ["Southern Europe"], continent: "Europe" },
  { code: "AD", regions: ["Southern Europe"], continent: "Europe" },
  { code: "BA", regions: ["Southern Europe"], continent: "Europe" },
  { code: "HR", regions: ["Southern Europe"], continent: "Europe" },
  { code: "GR", regions: ["Southern Europe"], continent: "Europe" },
  { code: "IT", regions: ["Southern Europe"], continent: "Europe" },
  { code: "MT", regions: ["Southern Europe"], continent: "Europe" },
  { code: "ME", regions: ["Southern Europe"], continent: "Europe" },
  { code: "MK", regions: ["Southern Europe"], continent: "Europe" },
  { code: "PT", regions: ["Southern Europe"], continent: "Europe" },
  { code: "SM", regions: ["Southern Europe"], continent: "Europe" },
  { code: "RS", regions: ["Southern Europe"], continent: "Europe" },
  { code: "SI", regions: ["Southern Europe"], continent: "Europe" },
  { code: "ES", regions: ["Southern Europe"], continent: "Europe" },
  { code: "VA", regions: ["Southern Europe"], continent: "Europe" },

  // Europe - Western
  { code: "GB", regions: ["Western Europe"], continent: "Europe" },
  { code: "AT", regions: ["Western Europe"], continent: "Europe" },
  { code: "BE", regions: ["Western Europe"], continent: "Europe" },
  { code: "FR", regions: ["Western Europe"], continent: "Europe" },
  { code: "DE", regions: ["Western Europe"], continent: "Europe" },
  { code: "LI", regions: ["Western Europe"], continent: "Europe" },
  { code: "LU", regions: ["Western Europe"], continent: "Europe" },
  { code: "MC", regions: ["Western Europe"], continent: "Europe" },
  { code: "NL", regions: ["Western Europe"], continent: "Europe" },
  { code: "CH", regions: ["Western Europe"], continent: "Europe" },

  // Oceania - Australia and New Zealand
  { code: "AU", regions: ["Australia and New Zealand"], continent: "Oceania" },
  { code: "NZ", regions: ["Australia and New Zealand"], continent: "Oceania" },

  // Oceania - Melanesia
  { code: "FJ", regions: ["Melanesia"], continent: "Oceania" },
  { code: "PG", regions: ["Melanesia"], continent: "Oceania" },
  { code: "SB", regions: ["Melanesia"], continent: "Oceania" },
  { code: "VU", regions: ["Melanesia"], continent: "Oceania" },

  // Oceania - Micronesia
  { code: "KI", regions: ["Micronesia"], continent: "Oceania" },
  { code: "MH", regions: ["Micronesia"], continent: "Oceania" },
  { code: "FM", regions: ["Micronesia"], continent: "Oceania" },
  { code: "NR", regions: ["Micronesia"], continent: "Oceania" },
  { code: "PW", regions: ["Micronesia"], continent: "Oceania" },

  // Oceania - Polynesia
  { code: "WS", regions: ["Polynesia"], continent: "Oceania" },
  { code: "TO", regions: ["Polynesia"], continent: "Oceania" },
  { code: "TV", regions: ["Polynesia"], continent: "Oceania" },
];
