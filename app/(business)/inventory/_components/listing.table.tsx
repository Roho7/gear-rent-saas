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
import { ListingType } from "@/src/entities/models/types";
import Link from "next/link";
import { useMemo } from "react";
import { BiTrash } from "react-icons/bi";
import { useInventory } from "../../_providers/useInventory";

export function ListingTable({ data }: { data: ListingType[] }) {
  const { productGroups } = useProducts();
  const { handleDeleteListing } = useInventory();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const formattedListingData = useMemo(() => {
    return data.map((listing) => {
      const productGroup = productGroups.find(
        (p) => p.product_group_id === listing.product_group_id,
      );
      return {
        ...listing,
        product_group_name: productGroup?.product_group_name,
        sport: productGroup?.sport,
      };
    });
  }, [data]);

  const columns: ColumnDef<ListingType>[] = useMemo(
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
        accessorKey: "listing_id",
        header: "Listing ID",
        cell: ({ row }) => (
          <div className="text-xs text-muted">{row.getValue("listing_id")}</div>
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
        accessorKey: "sport",
        header: "Sport",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("sport")}</div>
        ),
      },
      {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("size") || "-"}</div>
        ),
      },
      {
        accessorKey: "brands",
        header: "Brands",
        cell: ({ row }) => {
          const values = row.getUniqueValues<string>("brands");
          return <div className="capitalize">{values.join(", ") || "-"}</div>;
        },
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("gender") || "-"}</div>
        ),
      },
      {
        accessorKey: "base_price",
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
          const amount = parseFloat(row.getValue("base_price"));

          // Format the amount as a dollar amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: row.getValue("currency_code") || "USD",
          }).format(amount);

          return <div className="text-end">{formatted}</div>;
        },
      },
      {
        accessorKey: "discount_1",
        header: () => <div className="text-right">Discount 1</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {row.getValue("discount_1")}%
            </div>
          );
        },
      },
      {
        accessorKey: "discount_2",
        header: () => <div className="text-right">Discount 2</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {row.getValue("discount_2")}%
            </div>
          );
        },
      },
      {
        accessorKey: "discount_3",
        header: () => <div className="text-right">Discount 3</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {row.getValue("discount_3")}%
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
                  <Link href={`/inventory/listings/${listing.listing_id}`}>
                    Edit Listing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-1 text-destructive"
                  onClick={() => handleDeleteListing(listing.listing_id)}
                >
                  <BiTrash /> Delete Listing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDeleteListing, productGroups],
  );

  const table = useReactTable({
    data: formattedListingData,
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
      <div className="flex items-center py-4">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
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
