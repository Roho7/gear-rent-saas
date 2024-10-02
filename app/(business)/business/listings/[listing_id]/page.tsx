"use client";
import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addInventoryItem } from "@/app/(business)/_actions/add.listing.action";
import { useInventory } from "@/app/(business)/_providers/useBusiness";
import BackButton from "@/app/_components/_shared/back-button";
import { useProducts } from "@/app/_providers/useProducts";
import { formatProductName } from "@/lib/utils";
import { AddListingFormSchema } from "@/src/entities/models/formSchemas";
import { genderMap } from "@/src/entities/models/product";
import DiscountCombobox from "../../_components/discount.combobox";
import MultiSelectCombobox from "../../_components/multi-select.combobox";
import ProductCombobox from "../../_components/product.combobox";
import SingleSelectCombobox from "../../_components/single-select.combobox";
import { getInventoryItem } from "./_actions/inventory.actions";

const AddListingPage = () => {
  /**
   * * - Custom hooks
   */

  const { user } = useAuth();
  const { productGroups } = useProducts();
  const { handleDeleteListing, refreshBusinessData } = useInventory();
  const params = useParams<{ listing_id: string }>();
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
  const form = useForm<z.infer<typeof AddListingFormSchema>>({
    resolver: zodResolver(AddListingFormSchema),
    defaultValues: {
      product_group_id: "",
      description: "",
      currency_code: "GBP",
      base_price: 0,
      price_granularity: "daily",
      discount_1: 0,
      discount_2: 0,
      discount_3: 0,
      total_units: 1,
      available_units: 0,
    },
  });

  /**
   * * - Functions
   */
  const fetchInventoryItem = async (inventoryId: string) => {
    const item = await getInventoryItem(inventoryId);

    if (!item) {
      console.error("No inventory item found while fetching data");
      return;
    }
    // Update form values with fetched data
    form.reset({
      product_group_id: item?.product_group_id || "",
      description: item?.description || "",
      currency_code: item?.currency_code || "USD",
      base_price: item?.base_price || 0,
      price_granularity: item.price_granularity || "daily",
      discount_1: item?.discount_1 || 0,
      discount_2: item?.discount_2 || 0,
      discount_3: item?.discount_3 || 0,
      total_units: item?.total_units || 1,
      size: item?.size || "",
      brands: item?.brands || [],
      type: item?.type || "",
    });
  };

  async function onSubmit(data: z.infer<typeof AddListingFormSchema>) {
    try {
      if (!user) throw new Error("User not found");
      const formattedData = {
        ...data,
        store_id: user?.store_id,
        listing_id: params.listing_id === "new" ? undefined : params.listing_id,
      };

      const res = await addInventoryItem({ inventory_data: formattedData });

      if (res?.success) {
        toast({
          title:
            params.listing_id !== "new"
              ? "Listing updated successfully"
              : "Listing added successfully",
        });
        refreshBusinessData();
        router.back();
      }
    } catch (error: any) {
      toast({
        title: "Error submitting form",
        variant: "destructive",
        description: error.message ?? "Please try again later",
      });
    }
  }

  const updateDiscountedPrices = () => {
    const basePrice = form.getValues("base_price");
    setDiscountedPrices({
      discount1:
        basePrice - (basePrice * form.getValues("discount_1")) / 100 || 0,
      discount2:
        basePrice - (basePrice * form.getValues("discount_2")) / 100 || 0,
      discount3:
        basePrice - (basePrice * form.getValues("discount_3")) / 100 || 0,
    });

    setGranularity(
      form.getValues("price_granularity") === "daily" ? "day" : "hour",
    );
  };

  /**
   * * - Effects
   */

  const productTitle = useMemo(() => {
    const productGroupDetails = productGroups.find(
      (p) => p.product_group_id === form.getValues("product_group_id"),
    );
    return formatProductName({
      product_group_name: productGroupDetails?.product_group_name || "",
      size: form.getValues("size"),
      type: form.getValues("type"),
      gender: form.getValues("gender"),
      sport: productGroupDetails?.sport || "",
    });
  }, [
    form.watch("product_group_id"),
    form.watch("size"),
    form.watch("type"),
    form.watch("gender"),
  ]);

  useEffect(() => {
    updateDiscountedPrices();
  }, [
    form.watch("base_price"),
    form.watch("discount_1"),
    form.watch("discount_2"),
    form.watch("discount_3"),
    form.watch("product_group_id"),
    form.watch("currency_code"),
    form.watch("price_granularity"),
  ]);

  useEffect(() => {
    if (params.listing_id && params.listing_id !== "new") {
      fetchInventoryItem(params.listing_id);
    }
  }, [params]);

  /**
   * * - Render
   */

  return (
    <main className="p-4 overflow-y-auto overflow-x-hidden h-full flex flex-col max-w-full gap-2">
      <BackButton />
      <div className="flex flex-col lg:flex-row flex-1 gap-2">
        <Card className="lg:w-2/3">
          <CardHeader>
            <CardTitle>Add New Listing</CardTitle>
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
                    const basePrice = form.getValues("base_price");
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
                  name="product_group_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-700">
                        Select a product
                      </FormLabel>
                      <FormControl>
                        <ProductCombobox
                          productId={field.value}
                          disabled={params.listing_id !== "new"}
                          setProductId={form.setValue.bind(
                            null,
                            "product_group_id",
                          )}
                        />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2.5">
                        <FormLabel className="text-gray-700">Size</FormLabel>
                        <SingleSelectCombobox
                          data={
                            productGroups.find(
                              (p) =>
                                p.product_group_id ===
                                form.getValues("product_group_id"),
                            )?.sizes || []
                          }
                          value={field.value}
                          setValue={form.setValue.bind(null, "size")}
                          emptyMessage="Select a size"
                        />
                        <FormDescription>
                          The size or length of the product in centimeters
                        </FormDescription>
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2.5">
                        <FormLabel className="text-gray-700">Gender</FormLabel>
                        <SingleSelectCombobox
                          data={genderMap}
                          value={field.value}
                          setValue={form.setValue.bind(null, "gender")}
                          emptyMessage="Select a gender"
                        />
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-700">Type</FormLabel>
                        <FormControl>
                          <SingleSelectCombobox
                            data={
                              productGroups.find(
                                (p) =>
                                  p.product_group_id ===
                                  form.getValues("product_group_id"),
                              )?.types || []
                            }
                            value={field.value}
                            setValue={form.setValue.bind(null, "type")}
                            emptyMessage="Select a type"
                            hasSearch={true}
                          />
                        </FormControl>
                        <FormDescription>
                          The type that describes the product
                        </FormDescription>
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="currency_code"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2.5">
                        <FormLabel className="text-gray-700">
                          Currency
                        </FormLabel>
                        <SingleSelectCombobox
                          data={["USD", "EUR", "GBP", "INR", "AED"]}
                          value={field.value}
                          setValue={form.setValue.bind(null, "currency_code")}
                          emptyMessage="Select a currency"
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
                        <SingleSelectCombobox
                          data={["daily", "hourly"]}
                          value={field.value}
                          setValue={form.setValue.bind(
                            null,
                            "price_granularity",
                          )}
                          emptyMessage="Select a granularity"
                          hasSearch={true}
                        />

                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="total_units"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-700">
                          Total Units
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type here"
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          The total number of units of this product in your
                          inventory
                        </FormDescription>
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="available_units"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-700">
                          Available Units
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter available units"
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          The number of units of this product currently
                          available for rent
                        </FormDescription>
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="brands"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2.5">
                      <FormLabel className="text-gray-700">Brands</FormLabel>
                      <MultiSelectCombobox
                        data={
                          productGroups.find(
                            (p) =>
                              p.product_group_id ===
                              form.getValues("product_group_id"),
                          )?.brands || []
                        }
                        value={field.value || []}
                        setValue={form.setValue.bind(null, "brands")}
                        placeholder="Select brands"
                        emptyMessage="No brands available"
                      />
                      <FormDescription>
                        Select one or more brands for this listing
                      </FormDescription>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-2 flex-1">
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
                          recommendedDiscount={5}
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
                          recommendedDiscount={10}
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
                          recommendedDiscount={20}
                          onChange={updateDiscountedPrices}
                        />
                        <FormMessage className="text-red-700" />
                      </FormItem>
                    )}
                  />
                </div>
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
                          placeholder="Describe your product condition and variant information in as much detail as possible."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter important details like sizes, colors etc.
                      </FormDescription>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 ml-auto mt-auto">
                  {params.listing_id !== "new" && (
                    <Button
                      type="button"
                      size="sm"
                      variant={"destructive"}
                      onClick={() => {
                        handleDeleteListing(params.listing_id);
                      }}
                    >
                      Delete Listing
                    </Button>
                  )}
                  <Button type="submit" size="sm">
                    {params.listing_id !== "new" ? "Update Listing" : "Publish"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="w-1/3 sticky top-1/2 -translate-y-1/2 h-fit">
          <CardHeader className="flex gap-2">
            <CardTitle>Preview</CardTitle>
            <CardDescription className="capitalize">
              {productTitle}
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
    </main>
  );
};

export default AddListingPage;
