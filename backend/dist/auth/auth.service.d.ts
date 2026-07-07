import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export type AuthUser = {
    id: string;
    email: string;
    name: string;
};
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        user: AuthUser;
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: AuthUser;
        accessToken: string;
    }>;
    getProfile(userId: string): Promise<AuthUser>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<AuthUser>;
    deleteProfile(userId: string): Promise<void>;
    private buildAuthResponse;
    private toAuthUser;
}
