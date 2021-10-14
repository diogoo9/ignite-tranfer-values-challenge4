import { Request, Response } from "express";
import { container } from "tsyringe";
import { receiveMessageOnPort } from "worker_threads";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRASNFERS = "transfer",
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    let { id: user_id } = request.user;
    const { amount, description } = request.body;
    let sender_id = null;

    const splittedPath = request.originalUrl.split("/");
    if (splittedPath[4] === "transfer") {
      sender_id = request.params?.user_id?.toString();
    }

    const type = splittedPath[4] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return response.status(201).json(statement);
  }
}
