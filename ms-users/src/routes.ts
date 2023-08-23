import { Router } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controller/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { UserById, Users } from "./controller/user.controller";

export const routes = (router: Router) => {
  router.post('/api/register', Register);
  router.post('/api/login', Login);
  router.get('/api/user', AuthMiddleware, AuthenticatedUser);
  router.post('/api/logout', AuthMiddleware, Logout);
  router.put('/api/users/info', AuthMiddleware, UpdateInfo);
  router.put('/api/users/password', AuthMiddleware, UpdatePassword);
  router.get('/api/users', Users);
  router.get('/api/users/:id', UserById);
}