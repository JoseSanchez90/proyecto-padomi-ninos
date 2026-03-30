// lib/hooks/use-toast.ts
"use client";

import { gooeyToast, type GooeyToastOptions } from "goey-toast";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
};

export function useToast() {
  const toast = ({
    title,
    description,
    variant = "default",
    duration,
  }: ToastProps) => {
    const options: GooeyToastOptions = { description, duration };

    switch (variant) {
      case "success":
        return gooeyToast.success(title as string, options);
      case "error":
        return gooeyToast.error(title as string, options);
      case "warning":
        return gooeyToast.warning(title as string, options);
      case "info":
        return gooeyToast.info(title as string, options);
      default:
        return gooeyToast(title as string, options);
    }
  };

  return {
    toast,
    dismiss: (id?: string | number) => gooeyToast.dismiss(id),
  };
}
