
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  tempApiKey: string;
  setTempApiKey: (key: string) => void;
  onSave: () => void;
}

export const ApiKeyDialog = ({
  open,
  onOpenChange,
  apiKey,
  tempApiKey,
  setTempApiKey,
  onSave
}: ApiKeyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          <KeyRound className="mr-2 h-4 w-4" />
          {apiKey ? "Change API Key" : "Set API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to use the text rewriting service. Your key is stored locally in your browser and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="api-key" className="sr-only">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-3 w-3 mr-1" />
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Get an API key
            </a>
          </div>
          <Button type="submit" onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
