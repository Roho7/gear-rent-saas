"use client";
import { useProducts } from "@/app/_providers/useProducts";
import { createClientComponentClient } from "@/app/_utils/supabase";
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
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProductGroup } from "../_actions/product-group.admin.actions";

const EditProductGroupFormSchema = z.object({
  sport: z.string().min(1, { message: "Sport is required." }),
  product_group_name: z
    .string()
    .min(1, { message: "Product group name is required." }),
  sizes: z.string(),
  brands: z.string(),
  image: z.instanceof(File).optional().or(z.literal("")),
  types: z.string().optional(),
});

const ProductGroupsPage = () => {
  const form = useForm({
    resolver: zodResolver(EditProductGroupFormSchema),
    defaultValues: {
      sport: "",
      product_group_name: "",
      sizes: "",
      brands: "",
      image: undefined,
      types: "",
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
      types: group.types?.join(", ") || "",
      image: undefined,
    });
    setIsDialogOpen(true);
  };

  const uploadImage = async (
    file: File,
    sport: string,
    productGroupId: string,
  ): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${sport}/${productGroupId}-${dayjs().toISOString()}.${fileExt}`;
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.storage
      .from("product_thumbnails")
      .upload(fileName, file, { upsert: true });
    console.log(data);
    if (error) {
      throw new Error(error.message);
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
  };

  const onSubmit = async (data: z.infer<typeof EditProductGroupFormSchema>) => {
    try {
      if (!selectedGroup?.product_group_id) {
        throw new Error("No product group selected");
      }
      let imageUrl = "";
      if (data.image instanceof File) {
        const uploadedUrl = await uploadImage(
          data.image,
          data.sport,
          selectedGroup.product_group_id,
        );
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error("Failed to upload image");
        }
      }
      const updatedData = {
        ...data,
        image: undefined,
        image_url: imageUrl,
        product_group_id: selectedGroup.product_group_id,
        sizes: data.sizes.split(",").map((size) => size.trim()),
        brands: data.brands.split(",").map((brand) => brand.trim()),
        types: data.types?.split(",").map((type) => type.trim()) || [],
      };
      await updateProductGroup(updatedData);
      setIsDialogOpen(false);
      toast({ title: "Product group updated successfully" });
      fetchAndCacheProductGroups(true); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error updating product group",
        description: error.message ?? "",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Groups</h1>
      <Table containerClassName="max-h-[82vh] overflow-y-scroll">
        <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border bg-background">
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Product Group Name</TableHead>
            <TableHead>Sizes</TableHead>
            <TableHead>Brands</TableHead>
            <TableHead>Types</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto h-[500px] w-full">
          {productGroups.map((group) => (
            <TableRow key={group.product_group_id}>
              <TableCell>
                <div className="h-10 w-10">
                  <img
                    src={group.image_url || "/placeholder_image.png"}
                    className="w-full object-cover"
                    alt="pic"
                  />
                </div>
              </TableCell>
              <TableCell>{group.sport}</TableCell>
              <TableCell>{group.product_group_name}</TableCell>
              <TableCell>{group?.sizes?.join(", ")}</TableCell>
              <TableCell>{group?.brands?.join(", ")}</TableCell>
              <TableCell>{group?.types?.join(", ")}</TableCell>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="min-w-[70vw] ">
          <DialogHeader>
            <DialogTitle>Edit Product Group</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-h-[80vh] overflow-y-scroll px-2"
            >
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
              <div className="flex gap-2 w-full">
                <FormField
                  control={form.control}
                  name="types"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Types</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Freestyle, Racing, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Available types for this product group
                        (comma-separated).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
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
