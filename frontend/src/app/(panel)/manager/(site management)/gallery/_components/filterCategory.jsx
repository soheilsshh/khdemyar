"use client";

import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, Trash2, PenLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FilterCatgory() {
  const [items, setItems] = React.useState([
    { title: "مراسم نوروز", date: ["1404", "1403", "1402"] },
    { title: "مراسم غدیر", date: ["1404", "1403", "1402"] },
    { title: "محرم", date: ["1404", "1403", "1402"] },
    { title: "ماه رمضان", date: ["1404", "1403", "1402"] },
  ]);

  const router = useRouter();

  const handleEdit = (itemTitle, date = null) => {
    const basePath = `/manager/gallery/edit`;
    const query = date
      ? `?title=${encodeURIComponent(itemTitle)}&date=${date}`
      : `?title=${encodeURIComponent(itemTitle)}`;
    router.push(`${basePath}${query}`);
  };

  const handleDelete = (itemIndex, dateIndex = null) => {
    setItems((prev) => {
      const updated = [...prev];
      if (dateIndex === null) {
        updated.splice(itemIndex, 1);
      } else {
        updated[itemIndex].date.splice(dateIndex, 1);
      }
      return updated;
    });
  };

  return (
    <div className="w-full bg-[#EFFDF5] p-4 rounded-md shadow-lg">
      <Accordion.Root type="multiple" className="space-y-2">
        {items.map((item, itemIndex) => (
          <Accordion.Item
            key={itemIndex}
            value={`item-${itemIndex}`}
            className="border-b"
          >
            <Accordion.Header>
              <Accordion.Trigger
                className={cn(
                  "flex w-full items-center justify-between py-3 text-right font-medium text-black transition-all hover:text-orange-400",
                  "[&[data-state=open]>svg.rotate-icon]:rotate-180"
                )}
              >
                <div className="flex items-center gap-2">
                  <ChevronDownIcon className="w-4 h-4 rotate-icon transition-transform duration-200" />
                  <span>{item.title}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <PenLine
                    className="w-4 h-4 hover:text-blue-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item.title);
                    }}
                  />
                  <Trash2
                    className="w-4 h-4 hover:text-red-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(itemIndex);
                    }}
                  />
                </div>
              </Accordion.Trigger>
            </Accordion.Header>

            {item.date.map((date, dateIndex) => (
              <Accordion.Content
                key={dateIndex}
                className="overflow-hidden px-4 pb-3 text-sm text-gray-700"
              >
                <div className="flex justify-between items-center hover:text-orange-400">
                  <Link href="#">
                    <p>{date}</p>
                  </Link>
                  <div className="flex items-center gap-3 text-gray-600">
                    <PenLine
                      className="w-4 h-4 hover:text-blue-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item.title, date);
                      }}
                    />
                    <Trash2
                      className="w-4 h-4 hover:text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(itemIndex, dateIndex);
                      }}
                    />
                  </div>
                </div>
              </Accordion.Content>
            ))}
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
