import { toast } from "@/components/ui/use-toast";
import { StoreType } from "@/src/entities/models/types";
import { read, readFile, utils } from "xlsx";
import { createClientComponentClient } from "./supabase";

export async function readCSV(filePath: string) {
  try {
    const fileBuffer = await readFile(filePath);
    const workbook = read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return null;
  }
}

export const handleStoreImageUpload = async (
  file?: File,
  storeDetails?: StoreType,
  isGearyo?: boolean,
  refresh?: () => Promise<void>,
) => {
  if (!storeDetails?.store_id) return;
  if (file) {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.storage
      .from("store")
      .upload(
        `${storeDetails?.store_id}/store-cover-${storeDetails?.store_id}`,
        file,
        {
          upsert: true,
        },
      );

    toast({
      title: "Success",
      description: "Image uploaded successfully",
      variant: "default",
    });
    if (!data || error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Error uploading image",
        variant: "destructive",
      });
      return;
    }
    const store_image_path =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store/${data?.path}`;

    const table = isGearyo ? "tbl_gearyo_stores" : "tbl_stores";
    const { error: updateError } = await supabase
      .from(table)
      .update({
        store_img: store_image_path,
      })
      .eq("store_id", storeDetails?.store_id);

    if (updateError) {
      console.error("Error updating store image:", updateError);
      toast({
        title: "Error",
        description: "Error updating store image",
        variant: "destructive",
      });
      return;
    }
    if (refresh) {
      await refresh();
    }
  }
};
