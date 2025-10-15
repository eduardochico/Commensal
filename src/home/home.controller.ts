import { Controller, Get } from '@nestjs/common';

interface HomeScreenConfig {
  title: string;
  description: string;
  address: string;
  backgroundImageUrl: string;
  featuredPrize: string;
  prizes: string[];
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
    };
  }
}
