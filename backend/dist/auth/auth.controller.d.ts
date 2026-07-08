import type { Request } from 'express';
import { AuthService, AuthUser } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        user: AuthUser;
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: AuthUser;
        accessToken: string;
    }>;
    me(req: AuthenticatedRequest): Express.User & AuthUser;
    updateProfile(req: AuthenticatedRequest, dto: UpdateProfileDto): Promise<AuthUser>;
    deleteProfile(req: AuthenticatedRequest): Promise<void>;
    getStats(): Promise<{
        totalUsers: number;
    }>;
}
export {};
