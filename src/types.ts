export interface GameItem {
  id: string;
  title: string;
  category: 'Arcade' | 'Puzzle' | 'Action' | 'Sports' | 'Classic' | string;
  description: string;
  iframe: string;
  author?: string;
  tags?: string[];
  badge?: string;
  themeColor?: string;
  controls?: string[];
  isCustom?: boolean;
}

export type CategoryFilter = 'All' | 'Arcade' | 'Puzzle' | 'Action' | 'Sports' | 'Classic' | 'Favorites';
