"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateLedgerItem } from "@/actions/ledger";

enum FoodType {
  VEG = "b100339f-54d2-4562-a3b8-ec6a6b81b9f9",
  NONVEG = "a0e29436-77be-492c-b653-5f57eff3191c",
}

const items = [
  { name: "VEG", value: FoodType.VEG },
  { name: "NONVEG", value: FoodType.NONVEG },
];

export function ItemSelectionMenu({
  children,
  initialValueId,
  ledgerId,
  setLunchItemType,
}: {
  children: React.ReactNode;
  initialValueId: string;
  ledgerId: string;
  setLunchItemType: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValueId);
  const [isLoading, setIsLoading] = React.useState(false);

  console.log(value);

  console.log(initialValueId);
  console.log(ledgerId);

  const handleUpdate = async (itemName: string, itemValue: string) => {
    setIsLoading(true);
    setLunchItemType("");
    const updatedLedger = await updateLedgerItem(ledgerId, itemValue);
    console.log(updatedLedger);
    setLunchItemType(itemName);
    setIsLoading(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isLoading} asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[120px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search framework..." /> */}
          <CommandList>
            <CommandEmpty>No Item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    handleUpdate(item.name, item.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
