
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

interface RewriteButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const RewriteButton = ({ onClick, disabled, isLoading }: RewriteButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-11 px-8 text-base",
        "bg-pink-500 text-white",
        "hover:bg-pink-600",
        "focus-visible:ring-pink-400",
        "disabled:opacity-70 disabled:cursor-not-allowed"
      )}
      size="lg"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-5 w-5" />
      )}
      {isLoading ? 'Rewriting...' : 'Rewrite Text'}
    </Button>
  );
};
