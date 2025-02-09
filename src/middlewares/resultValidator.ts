import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export class ResultValidator{
    public static validateResult(request:Request, response:Response, next:NextFunction){
        try{
            const validationErros = validationResult(request)

            if(!validationErros.isEmpty()){
                return response.status(400).json({erros:validationErros.array()})
            }

            next()

        }catch(error:any){
            return response.status(500).json({message:error.message})
        }
    }
} 