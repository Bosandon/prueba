import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let userService = {
        createUser: jest.fn(),
        searchUser: jest.fn(),
        createAddress: jest.fn(),
        findAddressesByUserId: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: userService,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(Address),
                    useValue: {},
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });


    it('/POST users - should create a user', () => {
        const createUserDto = {
            rut: '12345678-9',
            nombre: 'Juan',
            primer_apellido: 'Pérez',
            segundo_apellido: 'González',
        };

        const createdUser = {
            id: 1,
            rut: '12345678-9',
            nombre: 'Juan',
            primer_apellido: 'Pérez',
            segundo_apellido: 'González',
            addresses: [],
        };

        userService.createUser.mockResolvedValue(createdUser);

        return request(app.getHttpServer())
            .post('/user/crearUsuario')
            .send(createUserDto)
            .expect(201)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toEqual(createdUser);
            });
    });

    it('/GET users - should search users', () => {
        const searchCriteria = {
            rut: '12345678-9',
            nombre: 'Juan',
            primer_apellido: 'Pérez',
            segundo_apellido: 'González',
        };

        const users = [
            { id: 1, rut: '12345678-9', nombre: 'Juan', primer_apellido: 'Pérez', segundo_apellido: 'González' },
        ];

        userService.searchUser.mockResolvedValue(users);

        return request(app.getHttpServer())
            .get('/user/buscarUsuario')
            .query(searchCriteria)
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toEqual(users);
            });
    });

    it('/POST users/crearDireccion - should create an address', () => {
        const createAddressDto = {
            calle: 'Calle 123',
            numero: '123',
            ciudad: 'Ciudad',
            usuarioId: 1,
        };

        const createdAddress = {
            id: 1,
            calle: 'Calle 123',
            numero: '123',
            ciudad: 'Ciudad',
            usuarioId: 1,
            usuario: null,
        };

        userService.createAddress.mockResolvedValue(createdAddress);

        return request(app.getHttpServer())
            .post('/user/crearDireccion')
            .send(createAddressDto)
            .expect(201)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toEqual(createdAddress);
            });
    });

    it('/GET users/direcciones/:id - should find addresses by user ID', () => {
        const userId = 1;
        const addresses = [
            { id: 1, calle: 'Calle 123', numero: '123', ciudad: 'Ciudad', usuarioId: userId, usuario: null },
            { id: 2, calle: 'Avenida 456', numero: '456', ciudad: 'Otra Ciudad', usuarioId: userId, usuario: null },
        ];

        userService.findAddressesByUserId.mockResolvedValue(addresses);

        return request(app.getHttpServer())
            .get(`/user/direcciones/${userId}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toEqual(addresses);
            });
    });
});