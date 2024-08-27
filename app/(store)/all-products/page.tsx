"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductMetadataType, ProductType } from "@/supabase/types";

import { useAuth } from "@/app/_providers/useAuth";
import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { categoryMap, genderMap, metadataOptions } from "@/data/contants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineUnfoldMore } from "react-icons/md";

type Props = {};

const ProductRow = ({ product }: { product: ProductType }) => {
  const [selectedGender, setSelectedGender] = useState<string[]>(
    product.product_metadata?.gender || [],
  );
  const [productTitle, setProductTitle] = useState<string>(
    product.product_title || "",
  );
  const [productDescription, setProductDescription] = useState<string>(
    product.description || "",
  );
  const [productCategory, setProductCategory] = useState<string>(
    product.category || "",
  );
  const [productMetadata, setProductMetadata] = useState<ProductMetadataType>(
    product.product_metadata || {},
  );
  const [newMetadataType, setNewMetadataType] = useState<string>("");
  const [collapsed, setCollapsed] = useState<
    Record<keyof ProductMetadataType, boolean>
  >(
    Object.keys(productMetadata).reduce((acc, key) => {
      acc[key as keyof ProductMetadataType] = true;
      return acc;
    }, {} as Record<keyof ProductMetadataType, boolean>),
  );

  const { updateProductMetadata } = useProducts();

  const addMetadataProperty = () => {
    if (newMetadataType && !productMetadata[newMetadataType]) {
      setProductMetadata((prev) => ({ ...prev, [newMetadataType]: [""] }));
      setNewMetadataType("");
    }
  };

  const addMetadataValue = (property: string) => {
    setProductMetadata((prev) => ({
      ...prev,
      [property]: [...prev[property], ""],
    }));
  };

  const updateMetadataValue = (
    property: string,
    index: number,
    value: string,
  ) => {
    setProductMetadata((prev) => ({
      ...prev,
      [property]: prev[property].map((v, i) => (i === index ? value : v)),
    }));
  };

  const saveProduct = async () => {
    const updatedProduct = {
      ...product,
      product_title: productTitle,
      description: productDescription,
      category: productCategory,
      product_metadata: {
        ...productMetadata,
        gender: selectedGender,
      },
    };
    await updateProductMetadata(updatedProduct);
    toast({
      title: "Product Updated",
    });
  };

  useEffect(() => {
    if (product.product_metadata) {
      const { gender, ...otherMetadata } =
        product.product_metadata as ProductMetadataType;
      setSelectedGender(gender || []);
      setProductCategory(product.category || "");
      setProductDescription(product.description || "");
      setProductTitle(product.product_title || "");
      setProductCategory(product.category || "");
      setProductMetadata(
        Object.entries(otherMetadata).reduce((acc, [key, value]) => {
          acc[key] = Array.isArray(value) ? value : [(value as any).toString()];
          return acc;
        }, {} as ProductMetadataType),
      );
    }
  }, [product]);

  return (
    <Card className="flex gap-2">
      <CardHeader>
        <div className="w-80 h-80 object-cover overflow-hidden">
          <img src={product.image_url || ""} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              value={productTitle || ""}
              name="title"
              placeholder={productTitle || ""}
              onChange={(e) => setProductTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="title">Category</Label>
            <Select
              value={productCategory || undefined}
              onValueChange={(value) => setProductCategory(value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {categoryMap.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              name="description"
              placeholder={product.description || ""}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="image_url">Image</Label>
            <Input
              type="text"
              value={product.image_url || ""}
              name="image_url"
              placeholder={product.image_url || ""}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <Label
            role="button"
            htmlFor="gender"
            className="capitalize p-2 flex items-center justify-between bg-muted rounded-md"
            onClick={() =>
              setCollapsed((prev) => ({ ...prev, gender: !collapsed.gender }))
            }
          >
            Gender
            <MdOutlineUnfoldMore />
          </Label>
          {!collapsed.gender && (
            <div className="flex gap-2">
              {genderMap.map((d: string) => (
                <div className="flex gap-1 text-sm items-center" key={d}>
                  <Checkbox
                    checked={selectedGender.includes(d)}
                    key={d}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedGender((prev) => [...prev, d])
                        : setSelectedGender(
                            selectedGender.filter((value) => value !== d),
                          );
                    }}
                  />
                  <Label htmlFor={d}>{d}</Label>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic metadata fields */}
          {Object.entries(productMetadata).map(([property, values]) => (
            <div key={property} className="flex flex-col gap-2">
              <Label
                role="button"
                htmlFor={property}
                className="capitalize p-2 flex items-center justify-between bg-muted rounded-md"
                onClick={() => {
                  console.log(collapsed);
                  setCollapsed((prev) => ({
                    ...prev,
                    [property]: !prev[property],
                  }));
                }}
              >
                {property}
                <MdOutlineUnfoldMore />
              </Label>
              {values.map(
                (value, index) =>
                  !collapsed[property] && (
                    <div key={`${property}-${index}`} className="flex gap-2">
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          updateMetadataValue(property, index, e.target.value)
                        }
                        placeholder={`Enter ${property}`}
                      />
                      {index === values.length - 1 && (
                        <Button onClick={() => addMetadataValue(property)}>
                          +
                        </Button>
                      )}
                      {
                        <Button
                          onClick={() => {
                            if (index === 0) {
                              const { [property]: _, ...rest } =
                                productMetadata;
                              setProductMetadata(rest as ProductMetadataType);
                              return;
                            }
                            setProductMetadata((prev) => ({
                              ...prev,
                              [property]: prev[property].filter(
                                (_, i) => i !== index,
                              ),
                            }));
                          }}
                        >
                          -
                        </Button>
                      }
                    </div>
                  ),
              )}
            </div>
          ))}

          {/* Add metadata */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="newMetadata">Add Property</Label>
            <div className="flex gap-2">
              <Select
                value={newMetadataType}
                onValueChange={setNewMetadataType}
              >
                <SelectTrigger id="newMetadata">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {metadataOptions
                      .filter((option) => !productMetadata[option])
                      .map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button onClick={addMetadataProperty}>Add</Button>
            </div>
          </div>

          <Button onClick={saveProduct}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AllProducstPage = (props: Props) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    fetchAndCacheData,
    setSearchQuery,
    productFilters,
    setProductFilters,
    filteredProducts,
  } = useProducts();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="w-full h-80" />
          <div className="flex flex-col gap-4">
            <Skeleton className="w-40 h-20" />
            <Skeleton className="w-40 h-20" />
            <Skeleton className="w-40 h-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-full h-80" />
          <div className="flex flex-col gap-4">
            <Skeleton className="w-40 h-20" />
            <Skeleton className="w-40 h-20" />
            <Skeleton className="w-40 h-20" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select>
          <SelectTrigger id="category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent position="popper" className="gap-2 flex flex-col">
            {categoryMap.map((d: string, index) => (
              <div className="flex gap-1 text-sm items-center my-2" key={d}>
                <Checkbox
                  checked={productFilters?.category.includes(d)}
                  key={d}
                  onCheckedChange={(checked) => {
                    setProductFilters((prev) => ({
                      ...prev,
                      category: checked
                        ? [...prev.category, d]
                        : prev.category.filter((value) => value !== d),
                    }));
                  }}
                />
                <Label htmlFor={d}>{d}</Label>
              </div>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger id="category">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent position="popper" className="gap-2 flex flex-col">
            {genderMap.map((d: string) => (
              <div className="flex items-center gap-2 my-1" key={d}>
                <Checkbox
                  checked={productFilters?.gender.includes(d)}
                  key={d}
                  onCheckedChange={(checked) => {
                    setProductFilters((prev) => ({
                      ...prev,
                      gender: checked
                        ? [...prev.gender, d]
                        : prev.gender.filter((value) => value !== d),
                    }));
                  }}
                />
                <Label htmlFor={d}>{d}</Label>
              </div>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={async () => {
            await fetchAndCacheData("products", true);
            toast({ title: "Data refreshed" });
          }}
        >
          Refresh
        </Button>
      </div>
      {filteredProducts.map((product) => (
        <ProductRow product={product} key={product.product_id} />
      ))}
    </div>
  );
};

export default AllProducstPage;
