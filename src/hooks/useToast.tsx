import { toast as hotToast } from 'react-hot-toast';
import { ToastContent } from './ToastContent';

interface ToastOptions {
  title: string;
  description: string;
  variant: 'success' | 'error' | 'info';
}

export function useToast(): {
  toast: (options: ToastOptions) => void;
} {
  return {
    toast: ({ title, description, variant }: ToastOptions) => {
      hotToast(
        <ToastContent title={title} description={description} variant={variant} />,
        { duration: 4000 }
      );
    },
  };
}