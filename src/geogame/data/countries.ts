export interface Country {
  code: string;
  regions: string[];
  continent: string;
}

export const countries: Country[] = [
  // Africa - Northern
  { code: "DZ", regions: ["NorthernAfrica"], continent: "Africa" },
  { code: "EG", regions: ["NorthernAfrica"], continent: "Africa" },
  { code: "LY", regions: ["NorthernAfrica"], continent: "Africa" },
  { code: "MA", regions: ["NorthernAfrica"], continent: "Africa" },
  { code: "SD", regions: ["NorthernAfrica"], continent: "Africa" },
  { code: "TN", regions: ["NorthernAfrica"], continent: "Africa" },

  // Africa - Eastern
  { code: "BI", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "KM", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "DJ", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "ER", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "ET", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "KE", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "MG", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "MW", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "MU", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "MZ", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "RW", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "SC", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "SO", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "SS", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "UG", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "TZ", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "ZM", regions: ["EasternAfrica"], continent: "Africa" },
  { code: "ZW", regions: ["EasternAfrica"], continent: "Africa" },

  // Africa - Middle
  { code: "AO", regions: ["MiddleAfrica"], continent: "Africa" },
  { code: "CM", regions: ["MiddleAfrica"], continent: "Africa" },
  { code: "CF", regions: ["MiddleAfrica"], continent: "Africa" },
  { code: "TD", regions: ["MiddleAfrica"], continent: "Africa" },
  { code: "CG", regions: ["MiddleAfrica"], continent: "Africa" },
  { code: "CD", regions: ["MiddleAfrica"], continent: "Africa" },
  { code: "GQ", regions: ["MiddleAfrica"], continent: "Africa" },
  { code: "GA", regions: ["MiddleAfrica"], continent: "Africa" },
  { code: "ST", regions: ["MiddleAfrica"], continent: "Africa" },

  // Africa - Southern
  { code: "BW", regions: ["SouthernAfrica"], continent: "Africa" },
  { code: "SZ", regions: ["SouthernAfrica"], continent: "Africa" },
  { code: "LS", regions: ["SouthernAfrica"], continent: "Africa" },
  { code: "NA", regions: ["SouthernAfrica"], continent: "Africa" },
  { code: "ZA", regions: ["SouthernAfrica"], continent: "Africa" },

  // Africa - Western
  { code: "BJ", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "BF", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "CV", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "CI", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "GM", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "GH", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "GN", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "GW", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "LR", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "ML", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "MR", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "NE", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "NG", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "SN", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "SL", regions: ["WesternAfrica"], continent: "Africa" },
  { code: "TG", regions: ["WesternAfrica"], continent: "Africa" },

  // Americas - Northern
  { code: "CA", regions: ["NorthernAmerica"], continent: "Americas" },
  { code: "US", regions: ["NorthernAmerica"], continent: "Americas" },

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
  { code: "BZ", regions: ["CentralAmerica"], continent: "Americas" },
  { code: "CR", regions: ["CentralAmerica"], continent: "Americas" },
  { code: "SV", regions: ["CentralAmerica"], continent: "Americas" },
  { code: "GT", regions: ["CentralAmerica"], continent: "Americas" },
  { code: "HN", regions: ["CentralAmerica"], continent: "Americas" },
  { code: "MX", regions: ["CentralAmerica"], continent: "Americas" },
  { code: "NI", regions: ["CentralAmerica"], continent: "Americas" },
  { code: "PA", regions: ["CentralAmerica"], continent: "Americas" },

  // Americas - South
  { code: "AR", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "BO", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "BR", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "CL", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "CO", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "EC", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "GY", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "PY", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "PE", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "SR", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "UY", regions: ["SouthAmerica"], continent: "Americas" },
  { code: "VE", regions: ["SouthAmerica"], continent: "Americas" },

  // Asia - Central
  { code: "KZ", regions: ["CentralAsia"], continent: "Asia" },
  { code: "KG", regions: ["CentralAsia"], continent: "Asia" },
  { code: "TJ", regions: ["CentralAsia"], continent: "Asia" },
  { code: "TM", regions: ["CentralAsia"], continent: "Asia" },
  { code: "UZ", regions: ["CentralAsia"], continent: "Asia" },

  // Asia - East
  { code: "CN", regions: ["EastAsia"], continent: "Asia" },
  { code: "JP", regions: ["EastAsia"], continent: "Asia" },
  { code: "MN", regions: ["EastAsia"], continent: "Asia" },
  { code: "KP", regions: ["EastAsia"], continent: "Asia" },
  { code: "KR", regions: ["EastAsia"], continent: "Asia" },

  // Asia - Southeast
  { code: "BN", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "KH", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "ID", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "LA", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "MY", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "MM", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "PH", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "SG", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "TH", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "TL", regions: ["SoutheastAsia"], continent: "Asia" },
  { code: "VN", regions: ["SoutheastAsia"], continent: "Asia" },

  // Asia - South
  { code: "AF", regions: ["SouthAsia"], continent: "Asia" },
  { code: "BD", regions: ["SouthAsia"], continent: "Asia" },
  { code: "BT", regions: ["SouthAsia"], continent: "Asia" },
  { code: "IN", regions: ["SouthAsia"], continent: "Asia" },
  { code: "MV", regions: ["SouthAsia"], continent: "Asia" },
  { code: "NP", regions: ["SouthAsia"], continent: "Asia" },
  { code: "PK", regions: ["SouthAsia"], continent: "Asia" },
  { code: "LK", regions: ["SouthAsia"], continent: "Asia" },

  // Asia - West
  { code: "IR", regions: ["WestAsia"], continent: "Asia" },
  { code: "AM", regions: ["WestAsia"], continent: "Asia" },
  { code: "AZ", regions: ["WestAsia"], continent: "Asia" },
  { code: "BH", regions: ["WestAsia"], continent: "Asia" },
  { code: "CY", regions: ["WestAsia"], continent: "Asia" },
  { code: "GE", regions: ["WestAsia"], continent: "Asia" },
  { code: "IQ", regions: ["WestAsia"], continent: "Asia" },
  { code: "IL", regions: ["WestAsia"], continent: "Asia" },
  { code: "JO", regions: ["WestAsia"], continent: "Asia" },
  { code: "KW", regions: ["WestAsia"], continent: "Asia" },
  { code: "LB", regions: ["WestAsia"], continent: "Asia" },
  { code: "OM", regions: ["WestAsia"], continent: "Asia" },
  { code: "QA", regions: ["WestAsia"], continent: "Asia" },
  { code: "SA", regions: ["WestAsia"], continent: "Asia" },
  { code: "SY", regions: ["WestAsia"], continent: "Asia" },
  { code: "TR", regions: ["WestAsia"], continent: "Asia" },
  { code: "AE", regions: ["WestAsia"], continent: "Asia" },
  { code: "YE", regions: ["WestAsia"], continent: "Asia" },

  // Europe - Eastern
  { code: "BY", regions: ["EasternEurope"], continent: "Europe" },
  { code: "BG", regions: ["EasternEurope"], continent: "Europe" },
  { code: "CZ", regions: ["EasternEurope"], continent: "Europe" },
  { code: "HU", regions: ["EasternEurope"], continent: "Europe" },
  { code: "PL", regions: ["EasternEurope"], continent: "Europe" },
  { code: "MD", regions: ["EasternEurope"], continent: "Europe" },
  { code: "RO", regions: ["EasternEurope"], continent: "Europe" },
  { code: "RU", regions: ["EasternEurope"], continent: "Europe" },
  { code: "SK", regions: ["EasternEurope"], continent: "Europe" },
  { code: "UA", regions: ["EasternEurope"], continent: "Europe" },
  { code: "EE", regions: ["EasternEurope"], continent: "Europe" },
  { code: "LV", regions: ["EasternEurope"], continent: "Europe" },
  { code: "LT", regions: ["EasternEurope"], continent: "Europe" },

  // Europe - Northern
  { code: "DK", regions: ["NorthernEurope"], continent: "Europe" },
  { code: "FI", regions: ["NorthernEurope"], continent: "Europe" },
  { code: "IS", regions: ["NorthernEurope"], continent: "Europe" },
  { code: "IE", regions: ["NorthernEurope"], continent: "Europe" },
  { code: "NO", regions: ["NorthernEurope"], continent: "Europe" },
  { code: "SE", regions: ["NorthernEurope"], continent: "Europe" },

  // Europe - Southern
  { code: "AL", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "AD", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "BA", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "HR", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "GR", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "IT", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "MT", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "ME", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "MK", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "PT", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "SM", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "RS", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "SI", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "ES", regions: ["SouthernEurope"], continent: "Europe" },
  { code: "VA", regions: ["SouthernEurope"], continent: "Europe" },

  // Europe - Western
  { code: "GB", regions: ["WesternEurope"], continent: "Europe" },
  { code: "AT", regions: ["WesternEurope"], continent: "Europe" },
  { code: "BE", regions: ["WesternEurope"], continent: "Europe" },
  { code: "FR", regions: ["WesternEurope"], continent: "Europe" },
  { code: "DE", regions: ["WesternEurope"], continent: "Europe" },
  { code: "LI", regions: ["WesternEurope"], continent: "Europe" },
  { code: "LU", regions: ["WesternEurope"], continent: "Europe" },
  { code: "MC", regions: ["WesternEurope"], continent: "Europe" },
  { code: "NL", regions: ["WesternEurope"], continent: "Europe" },
  { code: "CH", regions: ["WesternEurope"], continent: "Europe" },

  // Oceania - Australia and New Zealand
  { code: "AU", regions: ["AustraliaNewZealand"], continent: "Oceania" },
  { code: "NZ", regions: ["AustraliaNewZealand"], continent: "Oceania" },

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
