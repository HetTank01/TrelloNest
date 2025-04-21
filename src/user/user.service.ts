import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserDto } from './dto/user.dto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async register(userData: UserDto) {
    const existingUser = await this.userModel.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    if (!userData.password) {
      throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });

    const token = await jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '1h' },
    );

    return {
      data: {
        id: user.id,
        email: user.email,
        token: token,
      },
    };
  }

  async login(userData: UserLoginDto) {
    const user = await this.userModel.findOne({
      where: { email: userData.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = await jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '1h' },
    );

    return {
      data: {
        id: user.id,
        email: user.email,
        token: token,
      },
    };
  }
}
