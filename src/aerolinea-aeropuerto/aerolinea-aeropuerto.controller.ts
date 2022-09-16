/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Controller('aerolinea-aeropuerto')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService) { }

    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    async addAeropuertoToAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.addAeropuertoToAerolinea(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async findAeropuertoByAerolineaIdAeropuertoId(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.findAeropuertoByAerolineaIdAeropuertoId(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos')
    async findAeropuertosByAerolineaId(@Param('aerolineaId') aerolineaId: string) {
        return await this.aerolineaAeropuertoService.findAeropuertosByAerolineaId(aerolineaId);
    }

    @Put(':aerolineaId/aeropuertos')
    async associateAeropuertosToAerolinea(@Body() aeropuertosDto: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string) {
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto)
        return await this.aerolineaAeropuertoService.associateAeropuertosToAerolinea(aerolineaId, aeropuertos);
    }

    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    @HttpCode(204)
    async deleteAeropuertoOfAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.deleteAeropuertoOfAerolinea(aerolineaId, aeropuertoId);
    }
}
