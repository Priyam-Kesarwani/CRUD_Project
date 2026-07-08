import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService implements OnModuleInit {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(email: string, name: string, passwordHash: string): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    remove(id: string): Promise<void>;
    count(): Promise<number>;
    private generateUniqueUserCode;
    private backfillMissingUserCodes;
}
