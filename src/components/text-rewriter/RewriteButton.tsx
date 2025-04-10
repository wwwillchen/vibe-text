
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

interface RewriteButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  selectedTone: string;
  selectedLength: string;
}

export const RewriteButton = ({ onClick, disabled, isLoading, selectedTone, selectedLength }: RewriteButtonProps) => {
  // Dynamic styling based on tone and length
  const getButtonStyle = () => {
    // Base styles
    let styles = "w-full h-12 px-8 text-base font-bold transition-all duration-300 ";
    
    // Tone-based styling
    if (selectedTone === 'Professional') {
      styles += "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400 ";
    } else if (selectedTone === 'Casual') {
      styles += "bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-300 ";
    } else {
      styles += "bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-300 ";
    }
    
    // Length-based styling
    if (selectedLength === 'Shorter') {
      styles += "rounded-lg transform hover:scale-95 ";
    } else if (selectedLength === 'Longer') {
      styles += "rounded-xl transform hover:scale-105 ";
    } else {
      styles += "rounded-xl transform hover:scale-100 ";
    }
    
    return styles;
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        getButtonStyle(),
        "shadow-lg hover:shadow-xl",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        isLoading ? "animate-pulse" : "hover:animate-none"
      )}
      size="lg"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-6 w-6 animate-pulse" />
      )}
      <span className="text-lg">
        {isLoading ? 'TRANSFORMING TEXT...' : 'REWRITE MY TEXT!'}
      </span>
    </Button>
  );
};
