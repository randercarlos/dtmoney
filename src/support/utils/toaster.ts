import { ToastSeverity } from 'primevue/api';
import { app } from '@/main';

const toastLifeTime = 3000;

const Toaster = {
  success: (detail: string, summary: string | undefined = undefined) => {
    app.config.globalProperties.$toast.add({
      severity: ToastSeverity.SUCCESS,
      summary: summary,
      detail: detail,
      life: toastLifeTime,
    });
  },

  warn: (detail: string, summary: string | undefined = undefined) => {
    app.config.globalProperties.$toast.add({
      severity: ToastSeverity.WARN,
      summary: summary,
      detail: detail,
      life: toastLifeTime,
    });
  },

  error: (detail: string, summary: string | undefined = undefined) => {
    app.config.globalProperties.$toast.add({
      severity: ToastSeverity.ERROR,
      summary: summary,
      detail: detail,
      life: toastLifeTime,
    });
  },
};

export default Toaster;
