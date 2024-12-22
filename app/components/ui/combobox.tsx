import { Check, ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tag } from "./tag";

export function Combobox({
  options,
  value,
  onChange,
  createNewButton,
}: {
  options: { value: string; label: ReactNode }[];
  value: string[];
  onChange: (value: string[]) => void;
  createNewButton?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between pl-1 hover:bg-gray-50"
        >
          <div className="flex flex-row flex-wrap gap-1">
            {value.length ? (
              options
                ?.filter((framework) => value.includes(framework.value))
                .map((framework) => (
                  <Tag key={framework.value}>{framework.label}</Tag>
                ))
            ) : (
              <span className="pl-2">Välj taggar...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Sök taggar..." />
          <CommandList>
            <CommandEmpty>Inga taggar hittades. {createNewButton}</CommandEmpty>
            <CommandGroup>
              {options?.map((framework) => {
                const isSelected = value.includes(framework.value);
                return (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(newValue) => {
                      onChange(
                        value.includes(newValue)
                          ? value.filter((x) => x !== newValue)
                          : [...value, newValue]
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
