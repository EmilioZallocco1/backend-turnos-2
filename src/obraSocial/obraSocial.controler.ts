import { Request, Response } from 'express'
import {
  findAllObrasSociales,
  findOneObraSocial,
  addObraSocial,
  updateObraSocial,
  removeObraSocial,
} from './obrasocial.service.js'
import { buildPaginationResponse, getPagination } from '../utils/pagination.js'

async function findAll(req: Request, res: Response) {
  try {
    const { page, limit, offset } = getPagination(req.query);

    const { obrasSociales, total } = await findAllObrasSociales(
      page,
      limit,
      offset
    );

    res.status(200).json({
      message: "ok",
      ...buildPaginationResponse(obrasSociales, total, page, limit),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const obraSocial = await findOneObraSocial(id)
    res.status(200).json({ message: 'ok', data: obraSocial })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const obraSocial = await addObraSocial(req.body)
    res.status(201).json({ message: 'ok', data: obraSocial })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const obraSocialToUpdate = await updateObraSocial(id, req.body.sanitizedInput)
    res
      .status(200)
      .json({ message: 'obra social updated', data: obraSocialToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    await removeObraSocial(id)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { add, remove, update, findOne, findAll }