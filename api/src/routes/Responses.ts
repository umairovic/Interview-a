import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import ResponseDao from '@daos/Response/ResponseDao.mock';
import { paramMissingError } from '@shared/constants';

const responseDao = new ResponseDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;


/**
 * Add a response.
 *
 * @param req The Express Request.
 * @param res The Express Response.
 * @returns
 *   On success returns 201 created with an empty body.
 *   If the parameters are invalid, returns a 400 with an JSON object describing the error.
 */
 export async function addResponse(req: Request, res: Response) {
    const { response } = req.body;
    // console.log(response?.content.questions)
    if (!response) {
        return res.status(BAD_REQUEST)
                  .json({error: paramMissingError});
    }
    await responseDao.add(response);
    return res.status(CREATED).end();
}

export async function getAll(req: Request, res: Response) {
    console.log("check")
    const survey = await responseDao.getAll();
    if (survey) {
        return res.status(OK)
                  .json({survey});
    } else {
        return res.status(BAD_REQUEST).end();
    }
}


