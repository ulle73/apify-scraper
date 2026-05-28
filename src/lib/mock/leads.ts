export interface MockLeadRaw {
  title: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  categoryName?: string;
  totalScore?: number;
  reviewsCount?: number;
  url?: string;
  [key: string]: unknown;
}

export const mockLeads: MockLeadRaw[] = [
  {
    title: "Göteborgs Bilverkstad AB",
    website: "https://goteborgsbilverkstad.se",
    phone: "031-123 45 67",
    email: "info@goteborgsbilverkstad.se",
    address: "Bultgatan 12",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.6,
    reviewsCount: 124,
    url: "https://google.com/maps/place/Göteborgs+Bilverkstad+AB"
  },
  {
    title: "Meca Göteborg - Hisingens Bilservice",
    website: "https://meca.se/hisingens-bilservice",
    phone: "031-987 65 43",
    email: "hisingen@meca.se",
    address: "Herkulesgatan 24",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.2,
    reviewsCount: 87,
    url: "https://google.com/maps/place/Hisingens+Bilservice"
  },
  {
    title: "Bilia Göteborg - Almedal",
    website: "https://bilia.se/goteborg-almedal",
    phone: "0771-400 000",
    email: "almedal@bilia.se",
    address: "Almedalsvägen 15",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Volvo-återförsäljare & Verkstad",
    totalScore: 4.0,
    reviewsCount: 342,
    url: "https://google.com/maps/place/Bilia+Almedal"
  },
  {
    title: "Mekonomen Heden",
    website: "https://mekonomen.se/heden",
    phone: "031-711 22 33",
    email: "heden@mekonomen.se",
    address: "Södra Vägen 18",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.4,
    reviewsCount: 56,
    url: "https://google.com/maps/place/Mekonomen+Heden"
  },
  {
    title: "Speedy Bilservice Backaplan",
    website: "https://speedy.se/backaplan",
    phone: "031-510 520",
    email: "backaplan@speedy.se",
    address: "Backavägen 6",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.7,
    reviewsCount: 201,
    url: "https://google.com/maps/place/Speedy+Backaplan"
  },
  {
    title: "Vianor Göteborg - Sisjön",
    website: "https://vianor.se/goteborg-sisjon",
    phone: "031-285 410",
    email: "sisjon@vianor.se",
    address: "Datavägen 4",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Däckverkstad & Däckhotell",
    totalScore: 4.1,
    reviewsCount: 94,
    url: "https://google.com/maps/place/Vianor+Sisjön"
  },
  {
    title: "Bosch Car Service - Majorna",
    website: "https://boschcarservice.se/majorna",
    phone: "031-242 424",
    email: "majorna@boschcarservice.se",
    address: "Karl Johansgatan 88",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.5,
    reviewsCount: 112,
    url: "https://google.com/maps/place/Bosch+Majorna"
  },
  {
    title: "Landala Bil & Däck",
    website: "https://landalabil.se",
    phone: "031-203 010",
    email: "info@landalabil.se",
    address: "Kapellplatsen 3",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.8,
    reviewsCount: 45,
    url: "https://google.com/maps/place/Landala+Bil+Däck"
  },
  {
    title: "Guldhedens Bil & Plåt AB",
    website: "https://guldhedensbil.se",
    phone: "031-828 290",
    email: "verkstad@guldhedensbil.se",
    address: "Doktor Fries Torg 5",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.3,
    reviewsCount: 31,
    url: "https://google.com/maps/place/Guldhedens+Bil"
  },
  {
    title: "Avenyns Däck & Bilvård",
    website: "",
    phone: "031-161 617",
    address: "Lorensbergsgatan 7",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Däckverkstad",
    totalScore: 3.9,
    reviewsCount: 12,
    url: "https://google.com/maps/place/Avenyns+Däck"
  },
  {
    title: "Janssons Auto - Autoexperten",
    website: "https://autoexperten.se/janssons-auto",
    phone: "031-404 040",
    email: "janssons.auto@autoexperten.se",
    address: "Grafiska Vägen 4",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.5,
    reviewsCount: 154,
    url: "https://google.com/maps/place/Janssons+Auto"
  },
  {
    title: "Ringöns Bil & Plåt AB",
    website: "https://ringonsbil.se",
    phone: "031-231 230",
    email: "info@ringonsbil.se",
    address: "Ringögatan 14",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.2,
    reviewsCount: 22,
    url: "https://google.com/maps/place/Ringöns+Bil+Plåt"
  },
  {
    title: "Frölunda Bilservice",
    website: "https://frolundabilservice.se",
    phone: "031-291 910",
    email: "frl@frolundabilservice.se",
    address: "Lona Knapes Gata 7",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.4,
    reviewsCount: 68,
    url: "https://google.com/maps/place/Frölunda+Bilservice"
  },
  {
    title: "Angereds Bil & Däckhuset",
    website: "https://angeredsbil.se",
    phone: "031-330 330",
    email: "contact@angeredsbil.se",
    address: "Angereds Torg 12",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Däckverkstad",
    totalScore: 4.1,
    reviewsCount: 47,
    url: "https://google.com/maps/place/Angereds+Bil"
  },
  {
    title: "Kortedala Bilteknik AB",
    website: "",
    phone: "031-484 848",
    address: "Kortedala Torg 4",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.0,
    reviewsCount: 19,
    url: "https://google.com/maps/place/Kortedala+Bilteknik"
  },
  {
    title: "Eriksbergs Bilservice",
    website: "https://eriksbergsbilservice.se",
    phone: "031-555 666",
    email: "kontakt@eriksbergsbilservice.se",
    address: "Eriksbergsgatan 34",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.6,
    reviewsCount: 91,
    url: "https://google.com/maps/place/Eriksbergs+Bilservice"
  },
  {
    title: "Torslanda Bil & Motor",
    website: "https://torslandabilmotor.se",
    phone: "031-561 280",
    email: "info@torslandabilmotor.se",
    address: "Flygplatsvägen 12",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.7,
    reviewsCount: 73,
    url: "https://google.com/maps/place/Torslanda+Bil+Motor"
  },
  {
    title: "Gamlestadens Bilverkstad",
    website: "https://gamlestadensbil.se",
    phone: "031-252 525",
    email: "gamlestaden@gmail.com",
    address: "Artillerigatan 29",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.3,
    reviewsCount: 38,
    url: "https://google.com/maps/place/Gamlestadens+Bilverkstad"
  },
  {
    title: "Partille Bilservice AB",
    website: "https://partillebilservice.se",
    phone: "031-441 442",
    email: "service@partillebilservice.se",
    address: "Järnvägsgatan 5",
    city: "Partille",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 4.5,
    reviewsCount: 62,
    url: "https://google.com/maps/place/Partille+Bilservice"
  },
  {
    title: "Lundby Bilreparationer",
    website: "",
    phone: "031-224 455",
    address: "Lundbyvägen 45",
    city: "Göteborg",
    region: "Västra Götalands län",
    country: "Sverige",
    categoryName: "Bilverkstad",
    totalScore: 3.8,
    reviewsCount: 15,
    url: "https://google.com/maps/place/Lundby+Bilreparationer"
  }
];

export function getMockLeads(maxResults: number): Record<string, unknown>[] {
  const count = Math.min(maxResults, mockLeads.length);
  // Return shallow copies cast to Record<string, unknown>[]
  return mockLeads.slice(0, count).map(lead => ({ ...lead } as Record<string, unknown>));
}
