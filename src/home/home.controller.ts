import { Controller, Get } from '@nestjs/common';

interface HomeScreenConfig {
  title: string;
  description: string;
  address: string;
  backgroundImageUrl: string;
  secondaryImageUrl: string;
  featuredPrize: string;
  prizes: string[];
  longDescription: string;
  websiteUrl: string;
  instagramUrl: string;
  platesCarousel: string[];
  collageImages: string[];
  currentPoints: number;
  totalPoints: number;
  bigPrize: {
    name: string;
    description: string;
    imageUrl: string;
  };
  termsOfService: string;
}

@Controller('home')
export class HomeController {
  @Get()
  getConfig(): HomeScreenConfig {
    return {
      title: "Farmer's Apprentice Restaurant",
      description: 'Breakfast & Brunch Restaurant',
      address: '1147 Granville St, Vancouver',
      backgroundImageUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      secondaryImageUrl:
        'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1600&q=80',
      featuredPrize: 'AirPods Pro 2',
      prizes: [
        'Free Huevos Rancheros',
        '15% Off Order (up to $20)',
        'Complimentary Avocado Toast',
        "Chef's Tasting for Two",
        '$25 Gift Card',
        'Free Dessert Flight',
        'Bottomless Mimosa Upgrade',
      ],
      longDescription:
        'Cozy, warm space specializing in homemade brunch classics and vibrant Mexican fare with seasonal ingredients.',
      websiteUrl: 'https://farmersapprentice.ca',
      instagramUrl: 'https://www.instagram.com/farmersapprentice',
      platesCarousel: [
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544378730-8b5104b90d9e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1589308078054-832c8d99d4aa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
      ],
      collageImages: [
        'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1604908177070-30c3ce7201b7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1528731708534-816fe59f90cb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
      ],
      currentPoints: 320,
      totalPoints: 1000,
      bigPrize: {
        name: 'Gourmet Weekend in Mexico City',
        description: 'Round-trip flights, boutique hotel stay, and a chef-led tasting tour for two.',
        imageUrl:
          'https://images.unsplash.com/photo-1532634896-26909d0d4b6a?auto=format&fit=crop&w=900&q=80',
      },
      termsOfService:
        'By participating you agree to receive occasional SMS offers from Commensal. Rewards are subject to availability and must be redeemed in person. Limit one prize per guest every 30 days. Please present valid ID at pickup. Additional terms may apply.',
    };
  }
}
