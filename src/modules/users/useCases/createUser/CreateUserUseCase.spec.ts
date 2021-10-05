// create user, where email exists

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able create a new user", async () => {
    const response = await createUserUseCase.execute({
      name: "Diogo",
      email: "diogo@rentx.com.br",
      password: "12345",
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able a create user when already exists", async () => {
    await createUserUseCase.execute({
      name: "Diogo",
      email: "diogo@rentx.com.br",
      password: "12345",
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "Diogo",
        email: "diogo@rentx.com.br",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
