"use client";

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
import { Separator } from "@/components/ui/separator";
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
import Link from "next/link";
import { useMemo, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useAdmin } from "../_providers/useAdmin";

const AdminListingsPage = () => {
  const { allListings } = useAdmin();
  const { productGroups, allStores } = useProducts();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const enrichedInventory = useMemo(() => {
    return (
      allListings?.map((listing) => {
        const productGroup = productGroups.find(
          (pg) => pg.product_group_id === listing.product_group_id,
        );
        const store = allStores.find((s) => s.store_id === listing.store_id);
        return {
          ...listing,
          product_group_name: productGroup?.product_group_name || "Unknown",
          sport: productGroup?.sport || "Unknown",
          store_name: store?.store_name || "Unknown",
        };
      }) || []
    );
  }, [allListings, productGroups, allStores]);

  const columns: ColumnDef<
    ListingType & {
      product_group_name: string;
      sport: string;
      store_name: string;
    }
  >[] = useMemo(
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
        accessorKey: "store_name",
        header: "Store",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("store_name")}</div>
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
          const values = row.getValue<string[]>("brands");
          return <div className="capitalize">{values?.join(", ") || "-"}</div>;
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between items-center"
          >
            Base Price
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("base_price"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: row.getValue("currency_code") || "USD",
          }).format(amount);
          return <div className="text-end">{formatted}</div>;
        },
      },
      {
        accessorKey: "total_units",
        header: "Total Units",
        cell: ({ row }) => (
          <div className="text-center">
            {row.getValue("total_units") || "-"}
          </div>
        ),
      },
      {
        accessorKey: "available_units",
        header: "Avl. Units",
        cell: ({ row }) => (
          <div className="text-center">
            {row.getValue("available_units") || "-"}
          </div>
        ),
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
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(listing.store_id || "");
                    toast({
                      title: "Store ID copied",
                      description:
                        "The store ID has been copied to your clipboard.",
                    });
                  }}
                >
                  Copy Store ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/business/listings/${listing.listing_id}`}>
                    Edit Listing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-1 text-destructive">
                  <BiTrash /> Delete Listing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: enrichedInventory,
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
    },
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold md:text-2xl">All Listings</h1>
      </div>
      <Separator />
      {!enrichedInventory.length ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              There are no listings
            </h3>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Search by store name"
              value={
                (table.getColumn("store_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("store_name")
                  ?.setFilterValue(event.target.value)
              }
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
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
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
      )}
    </main>
  );
};

export default AdminListingsPage;
