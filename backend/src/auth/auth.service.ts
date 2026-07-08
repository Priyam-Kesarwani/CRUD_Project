import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

export type AuthUser = {
  id: string;
  userCode: string | null;
  email: string;
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(
      dto.email.toLowerCase(),
      dto.name,
      passwordHash,
    );

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toAuthUser(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<AuthUser> {
    const existingUser = await this.usersService.findById(userId);
    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }

    const normalizedEmail = dto.email.toLowerCase();
    const emailTaken = await this.usersService.findByEmail(normalizedEmail);
    if (emailTaken && emailTaken.id !== userId) {
      throw new ConflictException('Email is already registered');
    }

    const updatedUser = await this.usersService.update(userId, {
      email: normalizedEmail,
      name: dto.name,
    });

    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.toAuthUser(updatedUser);
  }

  async deleteProfile(userId: string): Promise<void> {
    const existingUser = await this.usersService.findById(userId);
    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }

    await this.usersService.remove(userId);
  }

  async getStats(): Promise<{ totalUsers: number }> {
    const totalUsers = await this.usersService.count();
    return { totalUsers };
  }

  private buildAuthResponse(user: {
    id: string;
    userCode: string | null;
    email: string;
    name: string;
  }) {
    const authUser = this.toAuthUser(user);
    const accessToken = this.jwtService.sign({
      sub: authUser.id,
      email: authUser.email,
    });

    return { user: authUser, accessToken };
  }

  private toAuthUser(user: {
    id: string;
    userCode: string | null;
    email: string;
    name: string;
  }): AuthUser {
    return {
      id: user.id,
      userCode: user.userCode,
      email: user.email,
      name: user.name,
    };
  }
}
