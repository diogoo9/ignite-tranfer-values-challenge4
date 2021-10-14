import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let user: User;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get balance", () => {
  beforeEach(async () => {
    user = new User();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should not be able get a balance when user does not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "12345",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("should be able get balance with deposit", async () => {
    const userResponse = await createUserUseCase.execute({
      email: "diogo@rentx.com.br",
      password: "12345",
      name: "Diogo",
    });

    const user_id = userResponse.id as string;

    const depositResponse = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "test",
      type: "deposit" as OperationType,
      sender_id: "",
    });

    const response = await getBalanceUseCase.execute({ user_id });

    expect(response).toHaveProperty("balance");
    expect(response).toHaveProperty("statement");
    expect(response.balance).toEqual(100);
  });

  it("should be able get balance with 0 value", async () => {
    const userResponse = await createUserUseCase.execute({
      email: "diogo@rentx.com.br",
      password: "12345",
      name: "Diogo",
    });

    const user_id = userResponse.id as string;

    const response = await getBalanceUseCase.execute({ user_id });

    expect(response).toHaveProperty("balance");
    expect(response.balance).toEqual(0);
  });

  it("should be able get balance", async () => {
    const userResponse = await createUserUseCase.execute({
      email: "diogo@rentx.com.br",
      password: "12345",
      name: "Diogo",
    });

    const user_id = userResponse.id as string;

    const deposit = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 1040,
      description: "salary",
      sender_id: "",
    });

    const withdraw = await createStatementUseCase.execute({
      user_id,
      type: OperationType.WITHDRAW,
      amount: 40,
      description: "shopping",
      sender_id: "",
    });

    const withdrawTwo = await createStatementUseCase.execute({
      user_id,
      type: OperationType.WITHDRAW,
      amount: 80,
      description: "shopping",
      sender_id: "",
    });

    const response = await getBalanceUseCase.execute({ user_id });

    expect(response).toHaveProperty("balance");
    expect(response.statement[0].id).toEqual(deposit.id);
    expect(response.statement[0].amount).toEqual(deposit.amount);
    expect(response.statement[1].id).toEqual(withdraw.id);
    expect(response.balance).toEqual(920);
  });

  it("should be able get balance without statement", async () => {
    const userResponse = await createUserUseCase.execute({
      email: "diogo@rentx.com.br",
      password: "12345",
      name: "Diogo",
    });

    const user_id = userResponse.id as string;

    const response = await inMemoryStatementsRepository.getUserBalance({
      user_id,
      with_statement: false,
    });

    expect(response).toHaveProperty("balance");
    expect(response).not.toHaveProperty("statement");
  });

  it("should be able get balance without statement", async () => {
    const userResponse = await createUserUseCase.execute({
      email: "diogo@rentx.com.br",
      password: "12345",
      name: "Diogo",
    });

    const user_id = userResponse.id as string;

    const response = await inMemoryStatementsRepository.getUserBalance({
      user_id,
    });

    expect(response).toHaveProperty("balance");
    expect(response).not.toHaveProperty("statement");
  });
});
