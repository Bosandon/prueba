import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './../service/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from '../entities/address.entity';
import { SearchUserDto } from '../dtos/search-user.dto';
import { CreateAddressDto } from '../dtos/create-address.dto';

describe('UsersController', () => {
  let controller: UserController;
  let userService: Partial<UserService>;

  beforeEach(async () => {
    userService = {
      createUser: jest.fn(),
      searchUser: jest.fn(),
      createAddress: jest.fn(),
      findAddressesByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: getRepositoryToken(User),
          useClass: jest.fn(),
        },
        {
          provide: getRepositoryToken(Address),
          useClass: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      rut: '12345678-9',
      nombre: 'Juan',
      primer_apellido: 'Pérez',
      segundo_apellido: 'González',
    };

    const createdUser: User = {
      id: 1,
      rut: '12345678-9',
      nombre: 'Juan',
      primer_apellido: 'Pérez',
      segundo_apellido: 'González',
      addresses: []
    };

    (userService.createUser as jest.Mock).mockResolvedValue(createdUser);
    const result = await controller.createUser(createUserDto);
    expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(createdUser);
  });

  it('should throw BadRequestException for invalid user data', async () => {
    const createUserDto: CreateUserDto = {
      rut: '12345678-8', // RUT inválido
      nombre: 'Juan',
      primer_apellido: 'Pérez',
      segundo_apellido: 'González',

    };

    (userService.createUser as jest.Mock).mockRejectedValue(new BadRequestException());
    await expect(controller.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
  });


  it('should search users', async () => {

    const searchCriteria: SearchUserDto = {
      rut: '12345678-9',
      nombre: 'Juan',
      primer_apellido: 'Pérez',
      segundo_apellido: 'González',
    };

    const users: User[] = [
      { id: 1, rut: '12345678-9', nombre: 'Juan', primer_apellido: 'Pérez', segundo_apellido: 'González', addresses: [] },
    ];

    (userService.searchUser as jest.Mock).mockResolvedValue(users);
    const result = await controller.searchUser(searchCriteria);
    expect(result).toEqual(users);
    expect(userService.searchUser).toHaveBeenCalledWith(searchCriteria);
  });

  it('should create an address', async () => {

    const createAddressDto: CreateAddressDto = {
      calle: 'Calle 123',
      numero: '123',
      ciudad: 'Ciudad',
      usuarioId: 1,
    };

    const createdAddress: Address = {
      id: 1,
      calle: 'Calle 123',
      numero: '123',
      ciudad: 'Ciudad',
      usuarioId: 1,
      usuario: null
    };

    (userService.createAddress as jest.Mock).mockResolvedValue(createdAddress);
    const result = await controller.createAddress(createAddressDto);
    expect(result).toEqual(createdAddress);
    expect(userService.createAddress).toHaveBeenCalledWith(createAddressDto);
  });

  it('should find addresses by user ID', async () => {

    const userId = 1;
    const addresses: Address[] = [
      { id: 1, calle: 'Calle 123', numero: '123', ciudad: 'Ciudad', usuarioId: userId, usuario: null },
      { id: 2, calle: 'Avenida 456', numero: '456', ciudad: 'Otra Ciudad', usuarioId: userId, usuario: null },
    ];

    (userService.findAddressesByUserId as jest.Mock).mockResolvedValue(addresses);
    const result = await controller.findAddressesByUserId(userId);
    expect(result).toEqual(addresses);
    expect(userService.findAddressesByUserId).toHaveBeenCalledWith(userId);
  });

});