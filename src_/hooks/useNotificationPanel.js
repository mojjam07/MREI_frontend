import { useNotificationContext } from './useNotificationContext';

export const useNotificationPanel = () => {
  const context = useNotificationContext();
  return {
    isOpen: context.isNotificationPanelOpen,
    toggle: context.toggleNotificationPanel,
    open: context.openNotificationPanel,
    close: context.closeNotificationPanel,
    unreadCount: context.unreadCount
  };
};

export default useNotificationPanel;
