import DropdownSelector from "@/app/_components/_shared/dropdown-selector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoryMap,
  expertiseMap,
  genderMap,
  metadataOptions,
} from "@/data/contants";
import { GenderType, ProductMetadataType } from "@/packages/types";

import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { bulkUpdateProducts } from "../_actions/admin.actions";

export function BulkEditModal({ productIds }: { productIds: string[] }) {
  const [productCategory, setProductCategory] = useState<string | undefined>(
    undefined,
  );
  const [productPrice, setProductPrice] = useState<string | undefined>(
    undefined,
  );
  const [selectedGender, setSelectedGender] = useState<GenderType | null>(null);
  const [productExperience, setProductExperience] = useState<string[]>([]);
  const [productMetadata, setProductMetadata] = useState<ProductMetadataType>(
    {},
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

  const handleSubmit = async () => {
    try {
      await bulkUpdateProducts(productIds, {
        category: productCategory,
        market_price: productPrice,
        gender: selectedGender,
        experience: productExperience.length ? productExperience : null,
        product_metadata: Object.keys(productMetadata).length
          ? productMetadata
          : undefined,
      });
      toast({
        description: "Products updated successfully",
      });
    } catch (error) {
      toast({
        description: "Error updating products",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Edit Metadata</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Metadata</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DropdownSelector
            data={categoryMap}
            onValueChange={setProductCategory}
            value={productCategory}
          />
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
                          ? setSelectedGender(gender as GenderType)
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
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
