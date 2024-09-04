"use client";
import ProductCard from "@/app/_components/product-card";
import { useAuth } from "@/app/_providers/useAuth";
import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ProductMetadataType, ProductType } from "@/packages/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiChevronLeft, FiExternalLink } from "react-icons/fi";
import { z } from "zod";
import { addInventoryItem } from "../../_actions/inventory.actions";
import CurrencyCombobox from "../_components/currency.combobox";
import DiscountCombobox from "../_components/discount.combobox";
import GranularityCombobox from "../_components/granularity.combobox";
import ProductCombobox from "../_components/product.combobox";
import {
  deleteInventoryItem,
  getInventoryItem,
} from "./_actions/inventory.actions";

type Props = {};

const addListingForm = z.object({
  product_id: z.string().min(1, { message: "Please select a product" }),
  description: z.string().min(10, { message: "Please enter a description" }),
  base_price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Please enter a valid price",
    }),
  price_granularity: z.enum(["daily", "hourly"]).default("daily"),
  currency_code: z.string().min(1, { message: "Please select a currency" }),
  discount_1: z.number().min(0, { message: "Please enter a valid discount" }),
  discount_2: z.number().min(0, { message: "Please enter a valid discount" }),
  discount_3: z.number().min(0, { message: "Please enter a valid discount" }),
  product_metadata: z
    .object({
      sizes: z.array(z.string()).nullable(),
      colors: z.array(z.string()).nullable(),
      lengths: z.array(z.string()).nullable(),
      widths: z.array(z.string()).nullable(),
    })
    .passthrough(),
});

const AddListingPage = (props: Props) => {
  /**
   * * - Custom hooks
   */

  const { products } = useProducts();
  const { user } = useAuth();
  const params = useParams<{ inventory_id: string }>();
  const router = useRouter();

  /**
   * * - States
   */

  const [discountedPrices, setDiscountedPrices] = useState({
    discount1: 0,
    discount2: 0,
    discount3: 0,
  });
  const [granularity, setGranularity] = useState("day");
  const [selectedProduct, setSelectedProduct] = useState<
    ProductType | undefined
  >();
  const [productMetadata, setProductMetadata] =
    useState<ProductMetadataType | null>(null);
  const form = useForm<z.infer<typeof addListingForm>>({
    resolver: zodResolver(addListingForm),
    defaultValues: {
      product_id: "",
      description: "",
      currency_code: "USD",
      base_price: "",
      price_granularity: "daily",
      discount_1: 0,
      discount_2: 0,
      discount_3: 0,
      product_metadata: {
        sizes: [],
        colors: [],
        lengths: [],
        widths: [],
      },
    },
  });

  /**
   * * - Functions
   */

  async function onSubmit(data: z.infer<typeof addListingForm>) {
    try {
      console.log("Submitting data", data);
      if (!user) throw new Error("User not found");
      const formattedData = {
        ...data,
        store_id: user?.store_id,
        inventory_id:
          params.inventory_id === "new" ? undefined : params.inventory_id,
      };

      await addInventoryItem({ inventory_data: formattedData });
      toast({
        title:
          params.inventory_id !== "new"
            ? "Listing updated successfully"
            : "Listing added successfully",
      });
      router.push("/inventory");
    } catch (error) {
      console.error("Error inserting data:", error);
      toast({
        variant: "destructive",
        title: "Error submitting form",
      });
    }
  }

  const handleDeleteInventoryItem = async () => {
    try {
      await deleteInventoryItem(params.inventory_id);
      toast({
        title: "Listing deleted",
      });
      router.push("/inventory");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error deleting listing",
      });
    }
  };

  const updateDiscountedPrices = () => {
    const basePrice = parseInt(form.getValues("base_price"));
    setDiscountedPrices({
      discount1:
        basePrice - (basePrice * form.getValues("discount_1")) / 100 || 0,
      discount2:
        basePrice - (basePrice * form.getValues("discount_2")) / 100 || 0,
      discount3:
        basePrice - (basePrice * form.getValues("discount_3")) / 100 || 0,
    });
    setSelectedProduct(
      products.find((p) => p.product_id === form.getValues("product_id")),
    );
    setGranularity(
      form.getValues("price_granularity") === "daily" ? "day" : "hour",
    );
  };

  /**
   * * - Effects
   */

  useEffect(() => {
    updateDiscountedPrices();
  }, [
    form.watch("base_price"),
    form.watch("discount_1"),
    form.watch("discount_2"),
    form.watch("discount_3"),
    form.watch("product_id"),
  ]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.product_metadata) {
      setProductMetadata(selectedProduct.product_metadata);
    }
  }, [selectedProduct]);

  const fetchInventoryItem = async (inventoryId: string) => {
    const item = await getInventoryItem(inventoryId);

    if (!item) {
      console.error("No inventory item found while fetching data");
      return;
    }
    // Update form values with fetched data
    form.reset({
      product_id: item?.product_id || "",
      description: item?.description || "",
      currency_code: item?.currency_code || "USD",
      base_price: item?.base_price?.toString() || "",
      price_granularity: item.price_granularity || "daily",
      discount_1: item?.discount_1 || 0,
      discount_2: item?.discount_2 || 0,
      discount_3: item?.discount_3 || 0,
      product_metadata: {
        sizes: item?.product_metadata.sizes || [],
        colors: item?.product_metadata.colors || [],
        lengths: item?.product_metadata.lengths || [],
        widths: item?.product_metadata.widths || [],
      },
    });
  };

  useEffect(() => {
    if (params.inventory_id && params.inventory_id !== "new") {
      fetchInventoryItem(params.inventory_id);
    }
  }, [params]);

  /**
   * * - Render
   */

  return (
    <section className="">
      <Button
        variant={"outline"}
        onClick={() => router.back()}
        className="bg-white my-2"
      >
        <FiChevronLeft /> Back
      </Button>
      <div className="flex gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Listing</CardTitle>
            <CardDescription>
              Create a new listing by filling up these details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6 flex flex-col h-full"
                onSubmit={form.handleSubmit(onSubmit)}
                onChange={() =>
                  setDiscountedPrices(() => {
                    const basePrice = parseInt(form.getValues("base_price"));
                    return {
                      discount1:
                        basePrice -
                        (basePrice * form.getValues("discount_1")) / 100,
                      discount2:
                        basePrice -
                        (basePrice * form.getValues("discount_2")) / 100,
                      discount3:
                        basePrice -
                        (basePrice * form.getValues("discount_3")) / 100,
                    };
                  })
                }
              >
                <FormField
                  control={form.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-700">
                        Select a product
                      </FormLabel>
                      <FormControl>
                        <ProductCombobox
                          productId={field.value}
                          disabled={params.inventory_id !== "new"}
                          setProductId={form.setValue.bind(null, "product_id")}
                        />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-700">
                        Product Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product condition and usage in as much detail as possible."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product_metadata"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Product Variants
                      </FormLabel>
                      {
                        <div className="space-y-4">
                          {(
                            Object.entries(productMetadata ?? {}) as [
                              keyof ProductMetadataType,
                              string[],
                            ][]
                          ).map(([property, values]) => (
                            <div key={property} className="flex flex-col gap-2">
                              <Label className="capitalize p-2 flex items-center justify-between bg-muted rounded-md">
                                {property}
                              </Label>
                              <div className="grid grid-cols-2 gap-2">
                                {values.map((value) => (
                                  <div
                                    key={`${property}-${value}`}
                                    className="flex items-center space-x-2"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={
                                          (
                                            field.value?.[
                                              property
                                            ] as Array<string>
                                          )?.includes(value) || false
                                        }
                                        onCheckedChange={(checked) => {
                                          const currentValues = [
                                            ...((field.value?.[
                                              property
                                            ] as Array<string>) || []),
                                          ];
                                          const newValues = checked
                                            ? [...currentValues, value]
                                            : currentValues.filter(
                                                (v) => v !== value,
                                              );

                                          form.setValue(
                                            "product_metadata",
                                            {
                                              ...field.value,
                                              [property]: newValues,
                                            },
                                            { shouldDirty: true },
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-700" />
                                    <Label htmlFor={`${property}-${value}`}>
                                      {value}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      }
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="currency_code"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2.5">
                        <FormLabel className="text-gray-700">
                          Currency
                        </FormLabel>
                        <CurrencyCombobox
                          currency={field.value}
                          setCurrency={form.setValue.bind(
                            null,
                            "currency_code",
                          )}
                          onChange={updateDiscountedPrices}
                        />
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="base_price"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-700">
                          Base Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type here"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The price of the product when rented for 3 days or
                          less
                        </FormDescription>
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price_granularity"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2.5">
                        <FormLabel className="text-gray-700">
                          Granularity
                        </FormLabel>
                        <GranularityCombobox
                          granularity={field.value}
                          setGranularity={form.setValue.bind(
                            null,
                            "price_granularity",
                          )}
                          onChange={updateDiscountedPrices}
                        />
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="discount_1"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2.5">
                        <FormLabel className="text-gray-700">
                          Discount for 3-6 days
                        </FormLabel>
                        <DiscountCombobox
                          discount={field.value}
                          setDiscount={form.setValue.bind(null, "discount_1")}
                          reccomendedDiscount={5}
                          onChange={updateDiscountedPrices}
                        />
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount_2"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2.5">
                        <FormLabel className="text-gray-700">
                          Discount for 7-14 days
                        </FormLabel>
                        <DiscountCombobox
                          discount={field.value}
                          setDiscount={form.setValue.bind(null, "discount_2")}
                          reccomendedDiscount={10}
                          onChange={updateDiscountedPrices}
                        />
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount_3"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2.5">
                        <FormLabel className="text-gray-700">
                          Discount 14 days and above
                        </FormLabel>
                        <DiscountCombobox
                          discount={field.value}
                          setDiscount={form.setValue.bind(null, "discount_3")}
                          reccomendedDiscount={20}
                          onChange={updateDiscountedPrices}
                        />
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2 ml-auto mt-auto">
                  {params.inventory_id !== "new" && (
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        handleDeleteInventoryItem();
                      }}
                    >
                      Delete Listing
                    </Button>
                  )}
                  <Button type="submit">
                    {params.inventory_id !== "new"
                      ? "Update Listing"
                      : "Publish"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex gap-2">
            <CardTitle>Preview</CardTitle>
            {selectedProduct && (
              <ProductCard
                product={selectedProduct}
                loading={false}
                showFooter={false}
              />
            )}
            <CardDescription>
              <ul>
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Market Price:</span>
                  <span className="text-lg">
                    £ {selectedProduct?.market_price || "N/A"}
                  </span>
                </li>
                {selectedProduct?.experience && (
                  <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="text-lg">
                      {selectedProduct?.experience?.join(", ")}
                    </span>
                  </li>
                )}
                {selectedProduct?.product_link && (
                  <li className="flex justify-between items-center hover:text-primary">
                    <span className="text-muted-foreground">Link:</span>
                    <a
                      className="flex items-center gap-1"
                      href={selectedProduct?.product_link || undefined}
                    >
                      <FiExternalLink /> View Product
                    </a>
                  </li>
                )}
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground">Base Price:</span>
                <span className="text-lg">
                  {form.getValues("currency_code")}{" "}
                  {form.getValues("base_price") || 0} /{granularity}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground">For 4-6 days</span>
                <span className="text-lg">
                  {form.getValues("currency_code")} {discountedPrices.discount1}{" "}
                  /{granularity}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground">For 7-14 days</span>
                <span className="text-lg ">
                  {form.getValues("currency_code")} {discountedPrices.discount2}{" "}
                  /{granularity}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground">14 days or more</span>
                <span className="text-lg">
                  {form.getValues("currency_code")} {discountedPrices.discount3}{" "}
                  /{granularity}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AddListingPage;
