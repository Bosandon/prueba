import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SearchUserDto } from '../dtos/search-user.dto';
import { CreateAddressDto } from '../dtos/create-address.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/crearUsuario')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('/buscarUsuario')
  async searchUser(@Query() searchUserDto: SearchUserDto) {
    return this.userService.searchUser(searchUserDto);
  }

  @Post('/crearDireccion')
  async createAddress(@Body() createAddressDto: CreateAddressDto) {
    return this.userService.createAddress(createAddressDto);
  }

  @Get('/direcciones/:id')
  async findAddressesByUserId(@Param('id') id: number) {
    return this.userService.findAddressesByUserId(id);
  }
}
