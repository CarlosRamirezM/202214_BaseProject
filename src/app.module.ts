import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaAeropuertoModule } from './aerolinea-aeropuerto/aerolinea-aeropuerto.module';

@Module({
  imports: [AerolineaModule, AeropuertoModule, AerolineaAeropuertoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
