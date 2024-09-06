// src/core/use-cases/auth/sign-up.use-case.ts

import { User } from "@supabase/supabase-js";
import { AuthRepository } from "../../repositories/auth.repository.interface";

export class SignUpUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string, name: string): Promise<User> {
    return this.authRepository.signUp(email, password, name);
  }
}
