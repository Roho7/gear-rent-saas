import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { deleteStore } from "../listings/[listing_id]/_actions/store.actions";

const DeleteStoreModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const handleStoreDelete = async () => {
    try {
      if (!user?.store_id) {
        throw new Error("User does not have a store");
      }
      await deleteStore(user.store_id);
      await refreshUser();
      router.refresh();
      toast({
        title: "Success",
        description: "Store deleted successfully",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error deleting store:", error);
      toast({
        title: "Error",
        description: error.message ?? "Error deleting store",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Store Permanently</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          Are you sure you cant to delete this store? This action cannot be
          undone.
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              variant="destructive"
              onClick={handleStoreDelete}
            >
              Delete
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStoreModal;
