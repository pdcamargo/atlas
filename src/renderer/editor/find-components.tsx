"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ComponentConstructor,
  ComponentManager,
  IComponent,
} from "@atlas/engine/core";
import { useDisclosure } from "@/hooks/use-disclosure";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

type FindComponentsProps = {
  onComponentSelect?: (component: ComponentConstructor<IComponent>) => void;
};

const FindComponents: React.FC<FindComponentsProps> = ({
  onComponentSelect,
}) => {
  const [buttonRef, setButtonRef] = React.useState<HTMLButtonElement | null>(
    null
  );
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover open={isOpen} onOpenChange={onToggle}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full rounded-none"
          ref={setButtonRef}
        >
          Add Component
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 frosted-glass"
        align="start"
        style={{
          width: buttonRef?.offsetWidth,
        }}
      >
        <Command disablePointerSelection={false}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {Array.from(ComponentManager.components).map(
              ([name, TargetComponent]) => (
                <CommandItem
                  key={name}
                  value={name}
                  onPointerDown={() => {
                    onComponentSelect?.(TargetComponent);
                    onClose();
                  }}
                >
                  {name}
                </CommandItem>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { FindComponents };
