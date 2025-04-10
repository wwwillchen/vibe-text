
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface TextTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  inputText: string;
  onInputChange: (value: string) => void;
  displayText: string;
  isLoading: boolean;
  isStreaming: boolean;
  placeholder: string;
}

export const TextTabs = ({
  activeTab,
  onTabChange,
  inputText,
  onInputChange,
  displayText,
  isLoading,
  isStreaming,
  placeholder
}: TextTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="original">Original</TabsTrigger>
        <TabsTrigger value="rewritten">Rewritten</TabsTrigger>
      </TabsList>
      <TabsContent value="original">
        <Textarea
          placeholder={placeholder}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isLoading || isStreaming}
          rows={12}
          className="resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-h-[240px] md:min-h-[320px]"
        />
      </TabsContent>
      <TabsContent value="rewritten">
        <Textarea
          placeholder="Rewritten text will appear here..."
          value={displayText}
          readOnly
          rows={12}
          className={cn(
            "resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-h-[240px] md:min-h-[320px]",
            isStreaming && "animate-pulse"
          )}
        />
        {isStreaming && (
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            <span>Streaming response...</span>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
