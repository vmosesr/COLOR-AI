interface ToastOptions {
  title: string;
  description: string;
  variant: 'success' | 'error' | 'info';
}

export function ToastContent({ title, description, variant }: ToastOptions) {
  const bgClass =
    variant === 'success'
      ? 'bg-green-500 text-white'
      : variant === 'error'
      ? 'bg-red-500 text-white'
      : 'bg-blue-500 text-white';
  return (
    <div className={bgClass}>
      <strong>{title}</strong>
      <div>{description}</div>
    </div>
  );
}