"use client";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { useProducts } from "@/app/_providers/useProducts";
import BookingStatusBadge from "@/app/account/_components/booking-status.badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import { BookingStatusType, BookingsType } from "@/src/entities/models/types";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import { BiTrash } from "react-icons/bi";

export function OrdersTable({ data }: { data: BookingsType[] }) {
  const { productGroups } = useProducts();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<BookingStatusType[]>(
    [],
  );

  const statuses: BookingStatusType[] = [
    "cancelled",
    "confirmed",
    "payment_pending",
    "payment_failed",
    "payment_successful",
    "fulfilled",
  ];
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const formattedOrdersData = useMemo(() => {
    return data.map((order) => {
      const productGroup = productGroups.find(
        (p) => p.product_group_id === order.product_group_id,
      );
      console.log("productGroup", productGroup);
      return {
        ...order,
        product_group_name: productGroup?.product_group_name,
        sport: productGroup?.sport,
      };
    });
  }, [data]);

  const filteredData = useMemo(() => {
    return formattedOrdersData.filter(
      (booking) =>
        filterStatus.length === 0 || filterStatus.includes(booking.status),
    );
  }, [formattedOrdersData, filterStatus]);

  const columns: ColumnDef<BookingsType>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "booking_id",
        header: "Booking ID",
        cell: ({ row }) => (
          <div className="text-xs text-muted">{row.getValue("booking_id")}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Booking Status",
        cell: ({ row }) => (
          <div className="capitalize">
            {<BookingStatusBadge status={row.getValue("status")} />}
          </div>
        ),
      },

      {
        accessorKey: "product_group_name",
        header: "Product Group",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("product_group_name")}</div>
        ),
      },
      {
        accessorKey: "total_price",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="w-full flex justify-between items-center"
            >
              Base Price
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("total_price"));

          // Format the amount as a dollar amount
          const formatted = formatPrice({
            base_price: amount,
            currency_code: row.getValue("currency_code"),
          });

          return <div className="text-end">{formatted}</div>;
        },
      },
      {
        accessorKey: "start_date",
        header: () => <div className="text-right">From</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {dayjs(row.getValue("start_date")).format("ddd, MMM D")}
            </div>
          );
        },
      },
      {
        accessorKey: "end_date",
        header: () => <div className="text-right">Till</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {dayjs(row.getValue("end_date")).format("ddd, MMM D")}
            </div>
          );
        },
      },
      {
        accessorKey: "currency_code",
        header: () => <div className="text-right">Currency Code</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {row.getValue("currency_code")}
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const listing = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(listing.listing_id);
                    toast({
                      title: "Listing ID copied",
                      description:
                        "The listing ID has been copied to your clipboard.",
                    });
                  }}
                >
                  Copy Listing ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/business/listings/${listing.listing_id}`}>
                    Edit Listing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-1 text-destructive"
                  onClick={() => {}}
                >
                  <BiTrash /> Delete Listing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [productGroups],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full ">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-1 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Status <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="capitalize"
                  checked={filterStatus.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilterStatus([...filterStatus, status]);
                    } else {
                      setFilterStatus(filterStatus.filter((s) => s !== status));
                    }
                  }}
                >
                  <BookingStatusBadge status={status} />
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table className="w-[100vw] overflow-x-scroll">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
