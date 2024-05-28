import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('Address')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    calle: string;

    @Column()
    numero: string;

    @Column()
    ciudad: string;

    @Column()
    usuarioId: number;

    @ManyToOne(() => User, user => user.addresses)
    usuario: User;
    
}