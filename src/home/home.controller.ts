import { Controller, Get } from '@nestjs/common';

interface HomeScreenConfig {
  title: string;
  description: string;
  address: string;
  backgroundImageUrl: string;
  secondaryImageUrl: string;
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
        'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1200&q=80',
      ],
      collageImages: [
        'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80',
      ],
      currentPoints: 320,
      totalPoints: 1000,
      bigPrize: {
        name: 'AirPods Pro 2',
        description: 'Win the same premium AirPods Pro 2 featured prize with adaptive audio and all-day comfort.',
        imageUrl: 'https://www.nicepng.com/png/detail/298-2982212_apple-airpods-png.png',
      },
      termsOfService:
        'By participating you agree to receive occasional SMS offers from Commensal. Rewards are subject to availability and must be redeemed in person. Limit one prize per guest every 30 days. Please present valid ID at pickup. Additional terms may apply.',
    };
  }
}
