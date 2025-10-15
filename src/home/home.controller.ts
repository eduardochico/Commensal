import { Controller, Get } from '@nestjs/common';

interface HomeScreenConfig {
  title: string;
  description: string;
  address: string;
  featuredPrize: string;
  prizes: string[];
}

@Controller('home')
export class HomeController {
  @Get()
  getConfig(): HomeScreenConfig {
    return {
      title: 'Commensal',
      description: 'Breakfast & Brunch Restaurant',
      address: '1147 Granville St, Vancouver',
      featuredPrize: 'AirPods Pro 2',
      prizes: ['Free Huevos Rancheros', '15% Off Order (up to $20)'],
    };
  }
}
