import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './../users/controller/user.controller';
import { UserService } from './../users/service/user.service';
import { User } from './../users/entities/user.entity';
import { Address } from './../users/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}