import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { User } from "../../entities/User";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let user: User;

let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeAll(async () => {
    user = new User();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );

    user.email = "diogo@rentx.com.br";
    user.password = "12345";
    user.name = "Diogo";

    await createUserUseCase.execute({
      email: user.email,
      password: user.password,
      name: user.name,
    });
  });

  it("should be able authenticate user", async () => {
    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able authenticate user when password as incorrect", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "11111",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able authenticate user when email as incorrect", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "teste@teste.coim.br",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able authenticate user when email and password as incorrect", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "teste@teste.coim.br",
        password: "122",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
