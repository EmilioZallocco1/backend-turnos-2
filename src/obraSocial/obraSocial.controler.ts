import { Request, Response } from "express";
import {
  findAllObrasSociales,
  findOneObraSocial,
  addObraSocial,
  updateObraSocial,
  removeObraSocial,
} from "../servicios/obrasocial.service.js";
import { buildPaginationResponse, getPagination } from "../utils/pagination.js";
import { asyncHandler } from "../shared/errors/asyncHandler.js";

const findAll = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPagination(req.query);
  const { obrasSociales, total } = await findAllObrasSociales(page, limit, offset);

  res.status(200).json({
    message: "ok",
    ...buildPaginationResponse(obrasSociales, total, page, limit),
  });
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const obraSocial = await findOneObraSocial(id);
  res.status(200).json({ message: "ok", data: obraSocial });
});

const add = asyncHandler(async (req: Request, res: Response) => {
  const obraSocial = await addObraSocial(req.body);
  res.status(201).json({ message: "ok", data: obraSocial });
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const obraSocialToUpdate = await updateObraSocial(id, req.body.sanitizedInput);

  res.status(200).json({
    message: "obra social updated",
    data: obraSocialToUpdate,
  });
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  await removeObraSocial(id);
  res.status(200).json({ message: "obra social deleted" });
});

export { add, remove, update, findOne, findAll };
