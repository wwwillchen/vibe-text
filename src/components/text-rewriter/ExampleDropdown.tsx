
"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen } from "lucide-react";
import { Example } from "./types";

interface ExampleDropdownProps {
  onSelect: (text: string) => void;
  examples: Example[];
}

export const ExampleDropdown = ({ onSelect, examples }: ExampleDropdownProps) => {
  return (
    <div className="flex justify-start mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Load Example
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Select an Example</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {examples.map((example, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => onSelect(example.text)}
              className="cursor-pointer"
            >
              {example.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
