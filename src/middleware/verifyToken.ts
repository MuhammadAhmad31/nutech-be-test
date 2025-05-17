import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

type UserData = {
    id: number;
    email: string;
};
interface ValidationRequest extends Request {
    headers: {
        authorization: string;
    };
    userData: UserData
}

export const verifyToken = (req: ValidationRequest, res: Response, next: NextFunction) => {
    const validationReq = req as ValidationRequest
    const {authorization} = validationReq.headers;

    if(!authorization){
        return res.status(401).json({
            message: 'Token diperlukan'
        })
    }

    const token = authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET!;

    try {
        const jwtDecode = jwt.verify(token, secret);

        if(typeof jwtDecode !== 'string'){
            validationReq.userData = jwtDecode as UserData
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    next()
};
