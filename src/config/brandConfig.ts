export interface BrandData {
  name: string;
  tagline: string;
  subTitle: string;
  city: string;
  currency: string;
  whatsappNumber?: string;
}

export const BRANDS: Record<string, BrandData> = {
  default: {
    name: "NOMADIQUE",
    tagline: "Кожаные сумки & аксессуары",
    subTitle: "РУЧНАЯ РАБОТА ИЗ НАТУРАЛЬНОЙ КОЖИ",
    city: "Алматы, Казахстан",
    currency: "₸",
    whatsappNumber: "+77017770000",
  },
  nomadique: {
    name: "NOMADIQUE",
    tagline: "Кожаные сумки & аксессуары",
    subTitle: "РУЧНАЯ РАБОТА ИЗ НАТУРАЛЬНОЙ КОЖИ",
    city: "Алматы, Казахстан",
    currency: "₸",
    whatsappNumber: "+77017770000",
  },
  atelier: {
    name: "ATELIER",
    tagline: "Fine Lifestyle Leather Goods",
    subTitle: "HOLD ON TO THE GOOD",
    city: "Almaty, KZ",
    currency: "₸",
    whatsappNumber: "+77017770000",
  },
  hakimage: {
    name: "HAKIMAGE",
    tagline: "Premium Leather Goods & Duffels",
    subTitle: "№1 В СФЕРЕ КОЖАНЫХ ИЗДЕЛИЙ",
    city: "Алматы, Казахстан",
    currency: "₸",
    whatsappNumber: "+77011234567",
  },
};
