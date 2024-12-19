import { Request, Response, NextFunction } from "express-serve-static-core";
import { AuthService } from "../services/AuthService";
import { Provider, VerifyOtpParams } from "@supabase/supabase-js";
import { UserData } from "../models/UserData";
import logger from "../utils/logger";
import {User} from "../models/UserModel";

export class AuthController {
    private supabaseService: AuthService;

    constructor() {
        this.supabaseService = new AuthService();

        // Use o bind para garantir que o this seja o mesmo dentro do método
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.signUp = this.signUp.bind(this);
        this.checkAuth = this.checkAuth.bind(this);
        this.checkAuthMiddleware = this.checkAuthMiddleware.bind(this);
        this.requestPasswordReset = this.requestPasswordReset.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.verifyTokenOPT = this.verifyTokenOPT.bind(this);
    }

    public async signIn(req: Request, res: Response) : Promise<void> {
        const { email, password } = req.body;
        let userData = new UserData({}, "");

        const { data, error } = await this.supabaseService.signInWithPassword(email, password);
        if (error) {
            res.status(400).json({ error: error });
            return
        }

        userData.setToken(data.session.access_token);
        userData.setUserData(data.user);

        res.status(200).json({ user: userData });
    }

    public async signOut(req: Request, res: Response) : Promise<void> {
        console.log(req);
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(400).json({ error: "Token not provided" });
            return;
        }

        const { error } = await this.supabaseService.signOut(token);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: "User signed out" });
    }

    public async signUp(req: Request, res: Response) : Promise<void> {
        const userData : User = req.body;
        const { file } = req;

        // Chamando o método signUp do SupaBaseService
        const { data, error } = await this.supabaseService.signUp(userData.email, userData.password);

        // Verificando se ocorreu algum erro
        if (error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
            return;
        }

        const uid = data.user.id;

        logger.info("User created");

        const token = data.session.access_token;


        // Chamando o método createUser do SupaBaseService

        const { error: errorCreateUser } = await this.supabaseService.createUserDb(userData, token, uid);

        if (errorCreateUser) {
            logger.error(errorCreateUser.message);
            res.status(400).json({ error: errorCreateUser.message });
            return;
        }

        logger.info("User created in database");

        res.status(200).json({ message: "User created" });
    }

    public async checkAuth(req: Request, res: Response) : Promise<void> {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(400).json({ error: "Token not provided" });
            return;
        }

        const { data, error } = await this.supabaseService.getUser(token);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ user: data });
    }

    public async checkAuthMiddleware(req: Request, res: Response, next: NextFunction) : Promise<void> {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(400).json({ error: "Token not provided" });
            return;
        }

        const { data, error } = await this.supabaseService.getUser(token);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        next();
    }

    public async requestPasswordReset(req: Request, res: Response) : Promise<void> {
        const { email } = req.body;

        const { error } = await this.supabaseService.requestPasswordReset(email);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: "Password reset requested" });
    }

    public async resetPassword(req: Request, res: Response) : Promise<void> {
        const { password, email, user} = req.body;

        const { error } = await this.supabaseService.resetPassword(email, password, user);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: "Password reset" });
    }

    public async verifyTokenOPT(req: Request, res: Response) : Promise<void> {
        const { token, email } = req.body;

        const verifyOtpParams: VerifyOtpParams = {
            token: token,
            email: email,
            type: "email"
        };

        const { data, error } = await this.supabaseService.verifyTokenOPT(verifyOtpParams);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ data });
    }
}