/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
      ) {}
    
      async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({relations: ["aerolineas"]});
      }
    
      async findOne(id: string): Promise<AeropuertoEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({where: {id}, relations: ["aerolineas"] });
        if (!aeropuerto)
          throw new BusinessLogicException("No se encontró el aereopuerto con el id dado", BusinessError.NOT_FOUND)
        else
          return aeropuerto;
      }
    
      async create(aeropuertoEntity: AeropuertoEntity): Promise<AeropuertoEntity> {
        if (aeropuertoEntity.codigo.length !== 3)
          throw new BusinessLogicException("El código del aeropuerto debe tener tres caracteres.", BusinessError.PRECONDITION_FAILED)
        return await this.aeropuertoRepository.save(aeropuertoEntity);
      }
    
      async update(id: string, aeropuertoEntity: AeropuertoEntity): Promise<AeropuertoEntity> {
        const aerpuerto = await this.aeropuertoRepository.findOne({where: {id}});
        if (!aerpuerto)
          throw new BusinessLogicException("No se encontró el aereopuerto con el id dado", BusinessError.NOT_FOUND)
        if (aeropuertoEntity.codigo.length !== 3)
          throw new BusinessLogicException("El código del aeropuerto debe tener tres caracteres.", BusinessError.PRECONDITION_FAILED)
        
        return await this.aeropuertoRepository.save({...aerpuerto, ...aeropuertoEntity});
      }
    
      async delete(id: string) {
        const aeropuerto = await this.aeropuertoRepository.findOne({where: {id}});
        if (!aeropuerto)
          throw new BusinessLogicException("No se encontró el aereopuerto con el id dado", BusinessError.NOT_FOUND)
        else
          return await this.aeropuertoRepository.remove(aeropuerto);
      }
}
