import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let user: User;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create statement", () => {
  beforeEach(async () => {
    user = new User();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should not be able a create statement when a user does not exists", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "12121212121",
        type: "withdraw" as OperationType,
        amount: 100,
        description: "testing",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able create statement withdraw when balance it's smaller than amount", async () => {
    user.email = "diogo@rentx.com.br";
    user.password = "12345";
    user.name = "Diogo";

    const userResponse = await createUserUseCase.execute({
      email: user.email,
      password: user.password,
      name: user.name,
    });

    const user_id = userResponse.id as string;

    expect(async () => {
      await createStatementUseCase.execute({
        user_id,
        amount: 100,
        description: "test",
        type: "withdraw" as OperationType,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should be able create a statement withdraw", async () => {
    user.email = "diogo@rentx.com.br";
    user.password = "12345";
    user.name = "Diogo";

    const userResponse = await createUserUseCase.execute({
      email: user.email,
      password: user.password,
      name: user.name,
    });

    const user_id = userResponse.id as string;

    await createStatementUseCase.execute({
      user_id,
      amount: 100,
      type: OperationType.DEPOSIT,
      description: "deposit to test",
    });

    const withdrawResponse = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      type: OperationType.WITHDRAW,
      description: "deposit to test",
    });

    expect(withdrawResponse).toHaveProperty("id");
  });

  it("should be able create a statement deposit", async () => {
    user.email = "diogo@rentx.com.br";
    user.password = "12345";
    user.name = "Diogo";

    const userResponse = await createUserUseCase.execute({
      email: user.email,
      password: user.password,
      name: user.name,
    });

    const user_id = userResponse.id as string;

    const depositResponse = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      type: OperationType.DEPOSIT,
      description: "deposit to test",
    });

    expect(depositResponse).toHaveProperty("id");
  });
});
