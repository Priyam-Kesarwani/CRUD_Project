import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

function generateUserCode(): string {
  return 'USR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.backfillMissingUserCodes();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(email: string, name: string, passwordHash: string): Promise<User> {
    const userCode = await this.generateUniqueUserCode();
    const user = this.usersRepository.create({
      userCode,
      email,
      name,
      passwordHash,
    });
    return this.usersRepository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.usersRepository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }

  private async generateUniqueUserCode(): Promise<string> {
    let userCode = generateUserCode();
    let attempts = 0;

    while (attempts < 5) {
      const existingUser = await this.usersRepository.findOne({
        where: { userCode },
      });
      if (!existingUser) {
        return userCode;
      }
      userCode = generateUserCode();
      attempts += 1;
    }

    throw new Error('Unable to generate a unique userCode');
  }

  private async backfillMissingUserCodes(): Promise<void> {
    const usersWithoutCode = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.userCode IS NULL')
      .getMany();

    for (const user of usersWithoutCode) {
      const userCode = await this.generateUniqueUserCode();
      await this.usersRepository.update(user.id, { userCode });
    }
  }
}
