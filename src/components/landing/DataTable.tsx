"use client";

import type { TableData } from "@/content/landing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: TableData;
  className?: string;
}

export function DataTable({ data, className }: DataTableProps) {
  const { title, columns, rows } = data;

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <p className="font-main text-sm font-semibold text-[var(--color-text)]">
          {title}
        </p>
      )}
      {/* 데스크톱 테이블 */}
      <div className="hidden overflow-x-auto rounded-xl glass md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--glass-border)] hover:bg-transparent">
              {columns.map((col) => (
                <TableHead 
                  key={col.key} 
                  className="whitespace-nowrap text-[var(--color-text-muted)] font-medium"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
                className="border-[var(--glass-border)] hover:bg-[var(--glass-bg-hover)]"
              >
                {columns.map((col) => (
                  <TableCell 
                    key={col.key} 
                    className="align-top text-[var(--color-text-secondary)]"
                  >
                    {row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* 모바일 카드 뷰 */}
      <div className="space-y-3 md:hidden">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="rounded-xl glass p-4 space-y-2"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex gap-2 text-sm">
                <span className="font-medium text-[var(--color-text-muted)] shrink-0">
                  {col.label}:
                </span>
                <span className="text-[var(--color-text-secondary)]">{row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
