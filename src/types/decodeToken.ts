import { Request } from "express";

export type decodeToken = {
    email: string;
    iat?: number;
    exp?: number;
}

export type UserData = {
    email: string;
};