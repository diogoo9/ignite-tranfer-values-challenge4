import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type,
    sender_id,
  }: ICreateStatementDTO): Promise<Statement> {
    let senderID = null;
    if (sender_id) {
      senderID = user_id;
      user_id = sender_id;
    }
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,
      sender_id: senderID,
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({
    statement_id,
    user_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id },
    });
  }

  async getUserBalance({
    user_id,
    with_statement = false,
  }: IGetBalanceDTO): Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  > {
    let statement = await this.repository.find({
      where: { user_id },
    });

    const transferSended = await this.repository.find({
      where: { sender_id: user_id },
    });

    let balance = statement.reduce((acc, operation) => {
      if (operation.type === "deposit" || operation.type === "transfer") {
        return acc + parseFloat(String(operation.amount));
      } else {
        return acc - operation.amount;
      }
    }, 0);

    statement = statement.concat(transferSended);

    const transferedValues = transferSended.reduce(
      (total = balance, operation) => {
        return total + parseFloat(String(operation.amount));
      },
      0
    );

    console.log(transferSended);
    balance -= transferedValues | 0;

    if (with_statement) {
      return {
        statement,
        balance,
      };
    }

    return { balance };
  }
}
