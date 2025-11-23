"use client";

import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FilterAccordion() {
  const items = [
    { title: "مراسم نوروز", date: ["1404", "1403", "1402"] },
    { title: "مراسم غدیر", date: ["1404", "1403", "1402"] },
    { title: " محرم ", date: ["1404", "1403", "1402"] },
    { title: "ماه رمضان", date: ["1404", "1403", "1402"] },
    { title: "مراسم نوروز", date: ["1404", "1403", "1402"] },
    { title: "مراسم غدیر", date: ["1404", "1403", "1402"] },
    { title: " محرم ", date: ["1404", "1403", "1402"] },
    { title: "ماه رمضان", date: ["1404", "1403", "1402"] },
  ];

  return (
    <div className="w-full bg-[#EFFDF5] p-4 rounded-md shadow-lg">
      <Accordion.Root type="multiple" className="space-y-2">
        {items.map((item, index) => (
          <Accordion.Item
            key={index}
            value={`item-${index}`}
            className="border-b"
          >
            <Accordion.Header>
              <Accordion.Trigger
                className={cn(
                  "flex w-full items-center justify-between py-3 text-right font-medium text-black transition-all hover:text-orange-400",
                  "[&[data-state=open]>svg]:rotate-180"
                )}
              >
                {item.title}
                <ChevronDownIcon className="w-4 h-4 ml-2 transition-transform duration-200" />
              </Accordion.Trigger>
            </Accordion.Header>
            {item.date.map((date, index) => (
              <Accordion.Content
                key={index}
                className="overflow-hidden px-4 pb-3 text-sm text-gray-700 hover:text-orange-400"
              >
                <Link href="#">
                  {" "}
                  <p>{date}</p>
                </Link>
              </Accordion.Content>
            ))}
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
