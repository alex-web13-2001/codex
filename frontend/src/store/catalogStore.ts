import { create } from 'zustand';

interface CatalogState {
  categories: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  categories: ['Design', 'Development', 'Marketing'],
  addCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories
        : [...state.categories, category]
    })),
  removeCategory: (category) =>
    set((state) => ({
      categories: state.categories.filter((item) => item !== category)
    }))
}));
