"use client";

import { cn } from "@/lib/utils";

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (nextPage: number) => void;
}

interface DataTableProps {
  title: string;
  headers: string[];
  rows: (string | React.ReactNode)[][];
  actions?: React.ReactNode;
  className?: string;
  selectedRowIndex?: number;
  onRowClick?: (rowIndex: number) => void;
  /** 전달 시 테이블 하단에 이전/다음 및 범위 표시 */
  pagination?: DataTablePaginationProps;
}

export function DataTable({
  title,
  headers,
  rows,
  actions,
  className,
  selectedRowIndex,
  onRowClick,
  pagination,
}: DataTableProps) {
  const totalPages =
    pagination && pagination.pageSize > 0
      ? Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize))
      : 1;
  const start =
    pagination && pagination.totalCount > 0
      ? (pagination.page - 1) * pagination.pageSize + 1
      : 0;
  const end =
    pagination && pagination.totalCount > 0
      ? Math.min(pagination.page * pagination.pageSize, pagination.totalCount)
      : 0;

  return (
    <div className={cn("glass min-w-0 rounded-2xl p-5", className)}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="min-w-0 text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        {actions && (
          <div className="flex w-full min-w-0 gap-2 sm:w-auto sm:justify-end">{actions}</div>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--glass-border)]">
        <table className="w-full min-w-0 text-left text-sm">
          <thead className="bg-[var(--glass-bg)]">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="min-w-0 align-top px-4 py-3 font-medium whitespace-normal text-[var(--color-text-muted)] sm:whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-t border-[var(--glass-border)] transition-colors hover:bg-[var(--glass-bg-hover)]",
                  onRowClick && "cursor-pointer",
                  selectedRowIndex === i && "bg-[var(--glass-bg-hover)]",
                )}
                onClick={onRowClick ? () => onRowClick(i) : undefined}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="min-w-0 break-words px-4 py-3 align-top text-[var(--color-text-secondary)]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-8 text-center text-[var(--color-text-subtle)]"
                >
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="mt-4 flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">
            {pagination.totalCount === 0
              ? "0건"
              : `${start.toLocaleString("ko-KR")}–${end.toLocaleString("ko-KR")} / 전체 ${pagination.totalCount.toLocaleString("ko-KR")}건`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={(e) => {
                e.stopPropagation();
                pagination.onPageChange(pagination.page - 1);
              }}
              className={cn(
                "rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-sm font-medium transition-colors",
                pagination.page <= 1
                  ? "cursor-not-allowed opacity-40"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg-hover)]",
              )}
            >
              이전
            </button>
            <span className="min-w-[4.5rem] text-center text-sm text-[var(--color-text-muted)]">
              {pagination.page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= totalPages}
              onClick={(e) => {
                e.stopPropagation();
                pagination.onPageChange(pagination.page + 1);
              }}
              className={cn(
                "rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-sm font-medium transition-colors",
                pagination.page >= totalPages
                  ? "cursor-not-allowed opacity-40"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--glass-bg-hover)]",
              )}
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
