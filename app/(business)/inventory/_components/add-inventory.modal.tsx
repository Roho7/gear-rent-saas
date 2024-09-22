import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DialogClose } from "@radix-ui/react-dialog";

type Props = {};

const AddInventoryItemModal = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Inventory item</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <ProductCombobox
            value={selectedProduct?.product_id}
            setValue={setSelectedProduct}
          /> */}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            {/* <Button type="submit" onClick={handleAddItem}>
              Add Product
            </Button> */}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryItemModal;
