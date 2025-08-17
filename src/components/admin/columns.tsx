"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Participant } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<Participant>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "raNumber",
    header: "RA Number",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Score
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue("score")}</div>
  },
  {
    accessorKey: "timeTaken",
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Time Taken
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
    cell: ({ row }) => {
      const timeTaken = row.getValue("timeTaken") as number;
      const minutes = Math.floor(timeTaken / 60);
      const seconds = timeTaken % 60;
      return <div className="text-right font-medium">{`${minutes}m ${seconds}s`}</div>;
    },
  },
];
