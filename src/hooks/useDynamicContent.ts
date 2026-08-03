import { useState, useEffect, useCallback } from 'react';
import {
  getHeroSlides,
  getPopularCategories,
  type HeroSlide,
  type PopularCategory
} from '../lib/dynamicContentApi';

export function useDynamicContent() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<PopularCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, c] = await Promise.all([getHeroSlides(), getPopularCategories()]);
      setSlides(s);
      setCategories(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch layout content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    slides,
    categories,
    loading,
    error,
    refetch: fetchContent
  };
}
