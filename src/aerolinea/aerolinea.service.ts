/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
      ) {}
    
      async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({relations: ["aeropuertos"]});
      }
    
      async findOne(id: string): Promise<AerolineaEntity> {
        const movement = await this.aerolineaRepository.findOne({where: {id}, relations: ["aeropuertos"] });
        if (!movement)
          throw new BusinessLogicException("No se encontró el aereolinea con el id dado", BusinessError.NOT_FOUND)
        else
          return movement;
      }
    
      async create(aerolineaEntity: AerolineaEntity): Promise<AerolineaEntity> {
        if (aerolineaEntity.fechaFundacion > (new Date()))
          throw new BusinessLogicException("La fecha de fundacion de la aerolinea debe ser en el pasado.", BusinessError.PRECONDITION_FAILED)
        return await this.aerolineaRepository.save(aerolineaEntity);
      }
    
      async update(id: string, aerolineaEntity: AerolineaEntity): Promise<AerolineaEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({where: {id}});
        if (!aerolinea)
          throw new BusinessLogicException("No se encontró el aereolinea con el id dado", BusinessError.NOT_FOUND)
        if (aerolineaEntity.fechaFundacion > (new Date()))
          throw new BusinessLogicException("La fecha de fundacion de la aerolinea debe ser en el pasado.", BusinessError.PRECONDITION_FAILED)
          
        return await this.aerolineaRepository.save({...aerolinea, ...aerolineaEntity});
      }
    
      async delete(id: string) {
        const movement = await this.aerolineaRepository.findOne({where: {id}});
        if (!movement)
          throw new BusinessLogicException("No se encontró el aereolinea con el id dado", BusinessError.NOT_FOUND)
        else
          return await this.aerolineaRepository.remove(movement);
      }
}
