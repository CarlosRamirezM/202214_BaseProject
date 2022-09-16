import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaService } from './aerolinea.service';
import { AerolineaController } from './aerolinea.controller';
import { AerolineaEntity } from './aerolinea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
  providers: [AerolineaService],
  controllers: [AerolineaController],
})
export class AerolineaModule {}
