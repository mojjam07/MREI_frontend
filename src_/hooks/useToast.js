import { useNotificationContext } from './useNotificationContext';

export const useToast = () => {
  const context = useNotificationContext();
  return {
    success: context.showSuccess,
    error: context.showError,
    warning: context.showWarning,
    info: context.showInfo
  };
};

export default useToast;
