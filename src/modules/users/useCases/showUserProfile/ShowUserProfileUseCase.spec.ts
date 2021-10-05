import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Show user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("shloud be able a user", async () => {
    const response = await createUserUseCase.execute({
      name: "Diogo",
      email: "teste@rentx.com.br",
      password: "12345",
    });

    const userId = response.id as string;

    const result = await showUserProfileUseCase.execute(userId);

    expect(response).toMatchObject(result);
  });

  it("shloud not be able a user when user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("11a2s1a2ss-asasaasas-wsd45f4d5fd");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
