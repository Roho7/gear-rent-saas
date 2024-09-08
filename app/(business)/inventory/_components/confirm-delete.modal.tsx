import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { deleteStore } from "../listings/[inventory_id]/_actions/store.actions";

type Props = {};

const DeleteStoreModal = ({ children }: { children: React.ReactNode }) => {
  const { user, refreshUser } = useAuth();
  const handleStoreDelete = async () => {
    if (!user?.store_id) {
      return;
    }
    const data = await deleteStore(user.store_id);
    if (!data) {
      console.error("Error deleting store");
      return;
    }
    await refreshUser();
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
