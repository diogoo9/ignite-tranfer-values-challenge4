import { Statement } from "../../entities/Statement";

export interface IStatement extends Statement {
  sender_ids: string;
}

export type ICreateStatementDTO = Pick<
  IStatement,
  "user_id" | "description" | "amount" | "type" | "sender_id"
>;
