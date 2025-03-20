import { toast, Toaster } from 'sonner';

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-right',
    duration: 3000
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-right',
    duration: 3000
  });
};

export const ToastProvider = () => <Toaster richColors />;