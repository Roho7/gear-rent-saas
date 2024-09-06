import { Store } from "@/src/entities/models/store";
import { StoreRepository } from "../../repositories/store.repository.usecase";

export class CreateStoreUseCase {
  constructor(private storeRepository: StoreRepository) {}

  async execute(name: string, ownerId: string): Promise<Store> {
    return this.storeRepository.createStore(name, ownerId);
  }
}
