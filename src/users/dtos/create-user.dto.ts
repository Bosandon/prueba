
export class CreateUserDto {
    readonly rut: string;
    readonly nombre: string;
    readonly primer_apellido?: string;
    readonly segundo_apellido?: string;
  }