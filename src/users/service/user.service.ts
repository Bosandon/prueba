import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SearchUserDto } from '../dtos/search-user.dto';
import { CreateAddressDto } from '../dtos/create-address.dto';
import { isValidRut } from './../../utils/rut-validator';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      if (!isValidRut(createUserDto.rut)) {
        throw new BadRequestException('Invalid RUT');
      }
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async searchUser(searchUserDto: SearchUserDto): Promise<User[]> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      if (searchUserDto.rut) {
        queryBuilder.andWhere('user.rut = :rut', { rut: searchUserDto.rut });
      }
      if (searchUserDto.nombre) {
        queryBuilder.andWhere('user.nombre ILIKE :nombre', { nombre: `%${searchUserDto.nombre}%` });
      }
      if (searchUserDto.primer_apellido) {
        queryBuilder.andWhere('user.primer_apellido ILIKE :primer_apellido', { primer_apellido: `%${searchUserDto.primer_apellido}%` });
      }
      if (searchUserDto.segundo_apellido) {
        queryBuilder.andWhere('user.segundo_apellido ILIKE :segundo_apellido', { segundo_apellido: `%${searchUserDto.segundo_apellido}%` });
      }

      const users = await queryBuilder.getMany();

      return users;
    } catch (error) {
      throw error;
    }
  }

  async createAddress(createAddressDto: CreateAddressDto): Promise<Address> {
    try {
      const user = await this.userRepository.findOneBy({ id: createAddressDto.usuarioId });
      if (!user) {
        throw new Error(`User with ID ${createAddressDto.usuarioId} not found`);
      }

      const address = this.addressRepository.create({
        calle: createAddressDto.calle,
        numero: createAddressDto.numero,
        ciudad: createAddressDto.ciudad,
        usuarioId: createAddressDto.usuarioId,
      });

      const savedAddress = await this.addressRepository.save(address);
      return savedAddress;
    } catch (error) {
      throw error;
    }

  }

  async findAddressesByUserId(userId: number): Promise<Address[]> {
    try {
      const addresses = await this.addressRepository.find({ where: { usuarioId: userId } });
      return addresses;
    } catch (error) {
      throw error;
    }
  }
}