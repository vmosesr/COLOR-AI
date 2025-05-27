import { SUPPORTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from './constants';

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Unsupported image format' };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { isValid: false, error: 'Image size exceeds 5MB' };
  }
  return { isValid: true };
};

export const validateProjectDescription = (description: string): { isValid: boolean; error?: string } => {
  if (description.length < 10) {
    return { isValid: false, error: 'Description must be at least 10 characters' };
  }
  return { isValid: true };
};