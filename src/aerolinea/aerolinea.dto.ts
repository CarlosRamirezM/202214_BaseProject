/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsDate} from 'class-validator';

export class AerolineaDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descipcion: string;

    @IsDate()
    @IsNotEmpty()
    readonly fechaFundacion: Date;

    @IsString()
    @IsNotEmpty()
    readonly paginaWeb: string;
}
