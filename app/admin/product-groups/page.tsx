"use client";
import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { ProductGroupType } from "@/src/entities/models/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProductGroup } from "../_actions/product-group.admin.actions";

const formSchema = z.object({
  sport: z.string().min(1, { message: "Sport is required." }),
  product_group_name: z
    .string()
    .min(1, { message: "Product group name is required." }),
  sizes: z.string(),
  brands: z.string(),
  image_url: z
    .string()
    .url({ message: "Must be a valid URL." })
    .nullable()
    .or(z.literal("")),
});

const ProductGroupsPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sport: "",
      product_group_name: "",
      sizes: "",
      brands: "",
      image_url: "",
    },
  });
  const { productGroups, fetchAndCacheProductGroups } = useProducts();
  const [selectedGroup, setSelectedGroup] = useState<ProductGroupType | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (group: ProductGroupType) => {
    setSelectedGroup(group);
    form.reset({
      sport: group.sport,
      product_group_name: group.product_group_name || "",
      sizes: group.sizes?.join(", ") || "",
      brands: group.brands?.join(", ") || "",
      image_url: group.image_url || "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!selectedGroup?.product_group_id) {
        throw new Error("No product group selected");
      }
      const updatedData = {
        ...data,
        product_group_id: selectedGroup.product_group_id,
        sizes: data.sizes.split(",").map((size) => size.trim()),
        brands: data.brands.split(",").map((brand) => brand.trim()),
      };
      await updateProductGroup(updatedData);
      setIsDialogOpen(false);
      toast({ title: "Product group updated successfully" });
      fetchAndCacheProductGroups(true); // Refresh the list
    } catch (error) {
      toast({ title: "Error updating product group", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Groups</h1>
      <Table containerClassName="max-h-[82vh] overflow-y-scroll">
        <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border bg-background">
          <TableRow>
            <TableHead>Sport</TableHead>
            <TableHead>Product Group Name</TableHead>
            <TableHead>Sizes</TableHead>
            <TableHead>Brands</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto h-[500px] w-full">
          {productGroups.map((group) => (
            <TableRow key={group.product_group_id}>
              <TableCell>{group.sport}</TableCell>
              <TableCell>{group.product_group_name}</TableCell>
              <TableCell>{group?.sizes?.join(", ")}</TableCell>
              <TableCell>{group?.brands?.join(", ")}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(group)}
                >
                  <DotsHorizontalIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product Group</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter sport" {...field} />
                    </FormControl>
                    <FormDescription>
                      The sport category for this product group.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_group_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Group Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product group name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The name of this product group.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter sizes, separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Available sizes for this product group (comma-separated).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brands"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brands</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter brands, separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Available brands for this product group (comma-separated).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL of the image for this product group.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGroupsPage;
