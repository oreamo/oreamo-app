import { Icon } from "@/components/common/display/Icon";
import { ToastBar } from "@/components/common/overlay/ToastBar";
import { useSystemToastStore } from "@/stores/system-toast-store";

export function SystemToastBar() {
  const { open, type, message, close } = useSystemToastStore();

  const icon = (() => {
    switch (type) {
      case "success":
        return <Icon iconName="CheckCircle" size="small" />;
      case "error":
        return <Icon iconName="Error" size="small" />;
      case "warning":
        return <Icon iconName="Warning" size="small" />;
      case "info":
        return <Icon iconName="Info" size="small" />;
    }
  })();

  return <ToastBar open={open} icon={icon} message={message} onClose={close} />;
}
