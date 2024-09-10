"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import StoreSidebar from "@/app/(public)/(store)/store/_components/store-sidebar";
import {
  categoryMap,
  expertiseMap,
  genderMap,
  metadataOptions,
} from "@/src/entities/models/product";
import {
  GenderType,
  ProductMetadataType,
  ProductType,
} from "@/src/entities/models/types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { BiSave, BiUpArrowCircle } from "react-icons/bi";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { BulkEditModal } from "../_components/bulk-edit.modal";
import { hideProduct } from "./_actions/product.actions";

type Props = {};

const ProductRow = ({
  product,
  selected,
  setSelected,
}: {
  product: ProductType;
  selected: boolean;
  setSelected: (selected: CheckedState) => void;
}) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(
    product.gender || null,
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
  const [productExperience, setProductExperience] = useState<string[]>(
    product.experience || [],
  );
  const [productImage, setProductImage] = useState<string>(
    product.image_url || "",
  );
  const [productPrice, setProductPrice] = useState<string>(
    product.market_price || "",
  );
  const [productMetadata, setProductMetadata] = useState<ProductMetadataType>(
    product.product_metadata || {},
  );
  const [newMetadataType, setNewMetadataType] = useState<string>("");
  const [collapsed, setCollapsed] = useState<
    Record<keyof ProductMetadataType, boolean>
  >(
    [...Object.keys(productMetadata), "experience"].reduce((acc, key) => {
      acc[key as keyof ProductMetadataType] = true;
      return acc;
    }, {} as Record<keyof ProductMetadataType, boolean>),
  );

  const { handleProductMetadataUpdate } = useProducts();

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

  const handleSaveProduct = async () => {
    const updatedProduct: ProductType = {
      ...product,
      product_title: productTitle,
      description: productDescription,
      category: productCategory,
      gender: selectedGender as GenderType | null,
      experience: productExperience,
      image_url: productImage,
      market_price: productPrice,
      product_metadata: {
        ...productMetadata,
      },
    };
    await handleProductMetadataUpdate(updatedProduct);
  };
  const handleHideProduct = async () => {
    try {
      const { success } = await hideProduct(product.product_id);
      if (success)
        toast({
          title: "Product Hidden",
        });
    } catch (error: any) {
      toast({
        title: "Error hiding product",
        description: error.message ?? "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex gap-2">
      <CardHeader>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => setSelected(checked)}
        />
        <div className="w-80 h-fit object-cover overflow-hidden">
          <img src={product.image_url || ""} />
        </div>
        <span className="text-xs">{product.product_id}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1 py-4">
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
            <Textarea
              name="description"
              value={productDescription || ""}
              placeholder={"Enter a description"}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="image_url">Image</Label>
            <Input
              type="text"
              value={productImage || ""}
              name="image_url"
              placeholder={"No image provided"}
              onChange={(e) => setProductImage(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="market_price">Market Price</Label>
            <Input
              type="text"
              value={productPrice || ""}
              name="image_url"
              placeholder={"Enter market price in £"}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {/* GENDER DROPDOWN */}
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
              {genderMap.map((gender: string) => (
                <div className="flex gap-1 text-sm items-center" key={gender}>
                  <Checkbox
                    checked={selectedGender === gender}
                    key={gender}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedGender(gender)
                        : setSelectedGender(null);
                    }}
                  />
                  <Label htmlFor={gender}>{gender}</Label>
                </div>
              ))}
            </div>
          )}
          {/* EXPERIENCE DROPDOWN */}

          <Label
            role="button"
            htmlFor="experience"
            className="capitalize p-2 flex items-center justify-between bg-muted rounded-md"
            onClick={() =>
              setCollapsed((prev) => ({
                ...prev,
                experience: !collapsed.experience,
              }))
            }
          >
            Experience
            <MdOutlineUnfoldMore />
          </Label>
          {!collapsed.experience && (
            <div className="flex gap-2">
              {expertiseMap.map((d: string) => (
                <div className="flex gap-1 text-sm items-center" key={d}>
                  <Checkbox
                    checked={productExperience.includes(d)}
                    key={d}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setProductExperience([...productExperience, d])
                        : setProductExperience(
                            productExperience.filter((value) => value !== d),
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

          <div className="flex gap-2 ml-auto">
            <Button variant={"outline"} onClick={handleHideProduct}>
              <EyeIcon size={16} /> Hide
            </Button>
            <Button onClick={handleSaveProduct}>
              <BiSave />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AllProducstPage = (props: Props) => {
  const { isLoading: isAuthLoading } = useAuth();
  const { filteredProducts } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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

  return (
    <div className="flex h-screen overflow-hidden">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center text-sm justify-between">
            <div className="flex gap-2 items-center h-10">
              <Checkbox
                partial={
                  selectedProducts.length > 0 &&
                  selectedProducts.length < filteredProducts.length
                }
                checked={selectedProducts.length > 0}
                onCheckedChange={() => {
                  if (selectedProducts.length > 0) {
                    setSelectedProducts([]);
                  } else {
                    setSelectedProducts(
                      filteredProducts.map((p) => p.product_id),
                    );
                  }
                }}
              />{" "}
              Select All
              {selectedProducts.length > 0 && (
                <span className="text-primary">
                  {selectedProducts.length} out of {filteredProducts.length}{" "}
                  selected
                </span>
              )}
            </div>
            {selectedProducts.length > 0 && (
              <BulkEditModal productIds={selectedProducts} />
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto" id="product-container">
          <div className="p-4 space-y-4">
            {filteredProducts.map((product) => (
              <ProductRow
                product={product}
                key={product.product_id}
                selected={selectedProducts.includes(product.product_id)}
                setSelected={(checked) =>
                  setSelectedProducts((prev) =>
                    checked
                      ? [...prev, product.product_id]
                      : prev.filter((id) => id !== product.product_id),
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
      <Button
        size={"icon"}
        variant={"secondary"}
        className="fixed bottom-4 right-4 rounded-full text-white"
        onClick={() =>
          document
            .getElementById("product-container")
            ?.scrollTo({ top: 0, behavior: "smooth" })
        }
      >
        <BiUpArrowCircle />
      </Button>
    </div>
  );
};

export default AllProducstPage;
