import { useState } from 'react';
import type { ColorGroup } from '../services/colors/colorExtractor';
import { useToast } from './useToast';

export const useColorExtraction = () => {
  const [colorGroups, setColorGroups] = useState<ColorGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const extractColors = async (file: File) => {
    setIsLoading(true);
    try {
      const imgUrl = URL.createObjectURL(file);
      setImageUrl(imgUrl);
    } catch (error: unknown) {
      let message = 'Failed to process image';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
      setIsLoading(false);
      throw error;
    }
  };

  return { colorGroups, setColorGroups, isLoading, extractColors, imageUrl };
};