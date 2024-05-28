import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from './address.entity';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    rut: string;

    @Column()
    nombre: string;

    @Column({ nullable: true })
    primer_apellido: string;

    @Column({ nullable: true })
    segundo_apellido: string;

    @OneToMany(() => Address, address => address.usuario)
    addresses: Address[];

}