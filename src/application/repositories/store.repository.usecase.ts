import { Store } from "@/src/entities/models/store";

export interface StoreRepository {
  createStore(name: string, ownerId: string): Promise<Store>;
  getStoreByOwner(ownerId: string): Promise<Store | null>;
}
