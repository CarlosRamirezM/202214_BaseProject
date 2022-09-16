/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { faker } from '@faker-js/faker';
import { AeropuertoService } from './aeropuerto.service';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aereopuertosList: AeropuertoEntity[];
  let dummyAerolineaList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AeropuertoService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    aereopuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.word.noun(),
        codigo: faker.word.noun(3),
        pais: faker.name.prefix(),
        ciudad: faker.address.cityName(),
      });
      aereopuertosList.push(aeropuerto);
    }
  };

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los aereopuertos', async () => {
    const aereopuerto: AeropuertoEntity[] = await service.findAll();
    expect(aereopuerto).not.toBeNull();
    expect(aereopuerto).toHaveLength(aereopuertosList.length);
  });

  it('findOne debe retornar aereopuerto por id', async () => {
    const storedAereopuerto: AeropuertoEntity = aereopuertosList[0];
    const aereopuerto: AeropuertoEntity = await service.findOne(
      storedAereopuerto.id,
    );
    expect(aereopuerto).not.toBeNull();
    expect(aereopuerto.nombre).toEqual(storedAereopuerto.nombre);
  });

  it('findOne debe lanzar una excepción por aereopuerto inválido', async () => {
    await expect(() => service.findOne('-1')).rejects.toHaveProperty(
      'message',
      'No se encontró el aereopuerto con el id dado',
    );
  });

  it('create debe crear un aeropuerto', async () => {
    const aereopuerto: AeropuertoEntity = {
      id: '',
      nombre: faker.address.country(),
      codigo: faker.word.noun(3),
      pais: faker.name.prefix(),
      ciudad: faker.word.noun(),
      aerolineas: dummyAerolineaList,      
    };

    const newaereopuerto: AeropuertoEntity = await service.create(aereopuerto);
    expect(newaereopuerto).not.toBeNull();

    const storedAereopuerto: AeropuertoEntity = await repository.findOne({
      where: { id: newaereopuerto.id },
    });
    expect(storedAereopuerto).not.toBeNull();
    expect(storedAereopuerto.nombre).toEqual(newaereopuerto.nombre);
    expect(storedAereopuerto.aerolineas).toEqual(newaereopuerto.aerolineas);
  });

  it('create debe lanzar una excepción por un aeropuerto con código inválido', async () => {
    const aereopuerto: AeropuertoEntity = {
      id: '',
      nombre: faker.address.country(),
      codigo: faker.word.noun(5),
      pais: faker.name.prefix(),
      ciudad: faker.word.noun(),
      aerolineas: dummyAerolineaList,      
    };

    await expect(() => service.create(aereopuerto)).rejects.toHaveProperty(
      'message',
      'El código del aeropuerto debe tener tres caracteres.',
    );
  });

  it('update debe actualizar un aeropuerto', async () => {
    const aereopuerto: AeropuertoEntity = aereopuertosList[0];
    aereopuerto.nombre = 'New name';

    const updatedAereopuerto: AeropuertoEntity = await service.update(
      aereopuerto.id,
      aereopuerto,
    );
    expect(updatedAereopuerto).not.toBeNull();

    const storedAereopuerto: AeropuertoEntity = await repository.findOne({
      where: { id: aereopuerto.id },
    });
    expect(storedAereopuerto).not.toBeNull();
    expect(storedAereopuerto.nombre).toEqual(aereopuerto.nombre);
  });

  it('update debe lanzar una excepción por aereopuerto inválido', async () => {
    let aereopuerto: AeropuertoEntity = aereopuertosList[0];
    aereopuerto = {
      ...aereopuerto,
      nombre: 'New name',
    };
    await expect(() => service.update('0', aereopuerto)).rejects.toHaveProperty(
      'message',
      'No se encontró el aereopuerto con el id dado',
    );
  });

  it('update debe lanzar una excepción por aereopuerto con código inválido', async () => {
    let aereopuerto: AeropuertoEntity = aereopuertosList[0];
    aereopuerto = {
      ...aereopuerto,
      codigo: faker.word.noun(5),
    };
    await expect(() => service.update(aereopuerto.id, aereopuerto)).rejects.toHaveProperty(
      'message',
      'El código del aeropuerto debe tener tres caracteres.',
    );
  });

  it('delete debe eliminar a aereopuerto', async () => {
    const aereopuerto: AeropuertoEntity = aereopuertosList[0];
    await service.delete(aereopuerto.id);

    const deletedaereopuerto: AeropuertoEntity = await repository.findOne({
      where: { id: aereopuerto.id },
    });
    expect(deletedaereopuerto).toBeNull();
  });

  it('delete debe lanzar una excepción por aereopuerto inválido', async () => {
    const aereopuerto: AeropuertoEntity = aereopuertosList[0];
    await service.delete(aereopuerto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encontró el aereopuerto con el id dado',
    );
  });
});
