/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];
  let dummyAeropuertoList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AerolineaService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    aerolineasList = [];
    for (let i = 0; i < 5; i++) {
      const aereolinea: AerolineaEntity = await repository.save({
        nombre: faker.word.noun(),
        descripcion: faker.lorem.paragraph(),
        fechaFundacion: faker.date.past(),
        paginaWeb: faker.lorem.word(),
      });
      aerolineasList.push(aereolinea);
    }
  };

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los aereolineas', async () => {
    const aereolinea: AerolineaEntity[] = await service.findAll();
    expect(aereolinea).not.toBeNull();
    expect(aereolinea).toHaveLength(aerolineasList.length);
  });

  it('findOne debe retornar aereolinea por id', async () => {
    const storedAereolinea: AerolineaEntity = aerolineasList[0];
    const aereolinea: AerolineaEntity = await service.findOne(
      storedAereolinea.id,
    );
    expect(aereolinea).not.toBeNull();
    expect(aereolinea.nombre).toEqual(storedAereolinea.nombre);
  });

  it('findOne debe lanzar una excepción por aereolinea inválida', async () => {
    await expect(() => service.findOne('-1')).rejects.toHaveProperty(
      'message',
      'No se encontró el aereolinea con el id dado',
    );
  });

  it('create debe crear un aeropuerto', async () => {
    const aereolinea: AerolineaEntity = {
      id: '',
      nombre: faker.word.noun(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.lorem.word(),
      aeropuertos: dummyAeropuertoList,
    };

    const newaereopuerto: AerolineaEntity = await service.create(aereolinea);
    expect(newaereopuerto).not.toBeNull();

    const storedAereopuerto: AerolineaEntity = await repository.findOne({
      where: { id: newaereopuerto.id },
    });
    expect(storedAereopuerto).not.toBeNull();
    expect(storedAereopuerto.nombre).toEqual(newaereopuerto.nombre);
    expect(storedAereopuerto.aeropuertos).toEqual(newaereopuerto.aeropuertos);
  });

  it('create debe lanzar excepcion por un aeropuerto con fecha invalida', async () => {
    const aerolinea: AerolineaEntity = {
      id: '',
      nombre: faker.word.noun(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.future(),
      paginaWeb: faker.lorem.word(),
      aeropuertos: dummyAeropuertoList,
    };

    await expect(() => service.create(aerolinea)).rejects.toHaveProperty("message", "La fecha de fundacion de la aerolinea debe ser en el pasado.");
  });

  it('update debe actualizar un aeropuerto', async () => {
    const aereolinea: AerolineaEntity = aerolineasList[0];
    aereolinea.nombre = 'New name';

    const updatedAereopuerto: AerolineaEntity = await service.update(
      aereolinea.id,
      aereolinea,
    );
    expect(updatedAereopuerto).not.toBeNull();

    const storedAereopuerto: AerolineaEntity = await repository.findOne({
      where: { id: aereolinea.id },
    });
    expect(storedAereopuerto).not.toBeNull();
    expect(storedAereopuerto.nombre).toEqual(aereolinea.nombre);
  });

  it('update debe lanzar una excepción por aereolinea inválida', async () => {
    let aereolinea: AerolineaEntity = aerolineasList[0];
    aereolinea = {
      ...aereolinea,
      nombre: 'New name',
    };
    await expect(() => service.update('0', aereolinea)).rejects.toHaveProperty(
      'message',
      'No se encontró el aereolinea con el id dado',
    );
  });

  it('update  debe lanzar una excepción por aereolinea con fecha inválida', async () => {
    const aereolinea: AerolineaEntity = aerolineasList[0];
    aereolinea.fechaFundacion = faker.date.future();

    await expect(() => service.update(aereolinea.id, aereolinea)).rejects.toHaveProperty(
      'message',
      'La fecha de fundacion de la aerolinea debe ser en el pasado.',
    );
  });

  it('delete debe eliminar a aereolinea', async () => {
    const aereolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aereolinea.id);

    const deletedaereopuerto: AerolineaEntity = await repository.findOne({
      where: { id: aereolinea.id },
    });
    expect(deletedaereopuerto).toBeNull();
  });

  it('delete debe lanzar una excepción por aereolinea inválida', async () => {
    const aereolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aereolinea.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encontró el aereolinea con el id dado',
    );
  });
});
