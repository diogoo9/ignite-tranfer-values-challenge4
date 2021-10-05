import { Statement } from "../../entities/Statement";

interface IStatement extends Statement {
  sender_id: string;
}

export type ICreateStatementDTO = Pick<
  IStatement,
  "user_id" | "description" | "amount" | "type" | "sender_id"
>;
