import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get withdraw", async () => {
    const userResponse = await createUserUseCase.execute({
      name: "Diogo",
      email: "diogo@rentx.com.br",
      password: "12345",
    });

    const user_id = userResponse.id as string;

    const statementResponse = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "Deposit from new year",
      type: OperationType.DEPOSIT,
      sender_id: "",
    });

    const statement_id = statementResponse.id as string;

    const statementOperationResponse =
      await getStatementOperationUseCase.execute({
        user_id,
        statement_id,
      });

    expect(statementOperationResponse).toHaveProperty("id");
  });

  it("should be able get withdraw when statement id not exists", async () => {
    const userResponse = await createUserUseCase.execute({
      name: "Diogo",
      email: "diogo@rentx.com.br",
      password: "12345",
    });

    const user_id = userResponse.id as string;

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "15455",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should be able get withdraw when statement id not exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "123456",
        statement_id: "15455",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
