import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);

export default userRouter;