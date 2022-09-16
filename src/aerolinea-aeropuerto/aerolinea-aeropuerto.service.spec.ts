/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService]
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.word.noun(),
        codigo: faker.word.noun(3),
        pais: faker.name.prefix(),
        ciudad: faker.address.cityName(),
        aereolineas: [],
      })
      aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.lorem.word(),
      aeropuertos: aeropuertosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoToAerolinea debería añadir un aeropuerto a una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.word.noun(),
      codigo: faker.word.noun(3),
      pais: faker.name.prefix(),
      ciudad: faker.address.cityName(),
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.lorem.word(),
    })

    const result: AerolineaEntity = await service.addAeropuertoToAerolinea(newAerolinea.id, newAeropuerto.id);

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre)
    expect(result.aeropuertos[0].codigo).toBe(newAeropuerto.codigo)
    expect(result.aeropuertos[0].pais).toBe(newAeropuerto.pais)
    expect(result.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad)
  });

  it('addAeropuertoToAerolinea debería lanzar una excepcion por un aeropuerto inválido', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.lorem.word(),
    })

    await expect(() => service.addAeropuertoToAerolinea(newAerolinea.id, "0")).rejects.toHaveProperty("message", "No se encontró el aeropuerto con el id dado");
  });

  it('addAeropuertoToAerolinea debería lanzar una excepcion por una aerolinea inválida', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.word.noun(),
      codigo: faker.word.noun(3),
      pais: faker.name.prefix(),
      ciudad: faker.address.cityName(),
    });

    await expect(() => service.addAeropuertoToAerolinea("0", newAeropuerto.id)).rejects.toHaveProperty("message", "No se encontró la aerolinea con el id dado");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId debería retornar un aeropuerto de una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAerolinea: AeropuertoEntity = await service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, aeropuerto.id)
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toBe(aeropuerto.nombre);
    expect(storedAerolinea.codigo).toBe(aeropuerto.codigo);
    expect(storedAerolinea.pais).toBe(aeropuerto.pais);
    expect(storedAerolinea.ciudad).toBe(aeropuerto.ciudad);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId debería lanzar una excepcion por un aeropuerto inválido', async () => {
    await expect(() => service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, "0")).rejects.toHaveProperty("message", "No se encontró el aeropuerto con el id dado");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId debería lanzar una excepcion por una aerolinea inválida', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() => service.findAeropuertoByAerolineaIdAeropuertoId("0", aeropuerto.id)).rejects.toHaveProperty("message", "No se encontró la aerolinea con el id dado");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId debería lanzar una excepcion por un aeropuerto no asociado a la aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.word.noun(),
      codigo: faker.word.noun(3),
      pais: faker.name.prefix(),
      ciudad: faker.address.cityName(),
    });

    await expect(() => service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no está asociado con la aerolinea");
  });

  it('findAeropuertosByAerolineaId debería retornar los aeropuertos de una aerolinea', async () => {
    const aereopuertos: AeropuertoEntity[] = await service.findAeropuertosByAerolineaId(aerolinea.id);
    expect(aereopuertos.length).toBe(5)
  });

  it('findAeropuertosByAerolineaId debería lanzar una excepcion por una aerolinea inválida', async () => {
    await expect(() => service.findAeropuertosByAerolineaId("0")).rejects.toHaveProperty("message", "No se encontró la aerolinea con el id dado");
  });

  it('associateAeropuertosToAerolinea debería actualizar la lista de aeropuertos de una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.word.noun(),
      codigo: faker.word.noun(3),
      pais: faker.name.prefix(),
      ciudad: faker.address.cityName(),
    });

    const updatedCulturaGastronomica: AerolineaEntity = await service.associateAeropuertosToAerolinea(aerolinea.id, [newAeropuerto]);
    expect(updatedCulturaGastronomica.aeropuertos.length).toBe(1);

    expect(updatedCulturaGastronomica.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(updatedCulturaGastronomica.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(updatedCulturaGastronomica.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(updatedCulturaGastronomica.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
  });

  it('associateAeropuertosToAerolinea debería lanzar una excepcion por una aerolinea inválida', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.word.noun(),
      codigo: faker.word.noun(3),
      pais: faker.name.prefix(),
      ciudad: faker.address.cityName(),
    });

    await expect(() => service.associateAeropuertosToAerolinea("0", [newAeropuerto])).rejects.toHaveProperty("message", "No se encontró la aerolinea con el id dado");
  });

  it('associateAeropuertosToAerolinea debería lanzar una excepcion por un aeropuerto inválido', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = "0";

    await expect(() => service.associateAeropuertosToAerolinea(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "No se encontró el aeropuerto con el id dado");
  });

  it('deleteAeropuertoOfAerolinea debería remover un aeropuerto de una aerolinea', async () => {
    const artwork: AeropuertoEntity = aeropuertosList[0];

    await service.deleteAeropuertoOfAerolinea(aerolinea.id, artwork.id);

    const storedMuseum: AerolineaEntity = await aerolineaRepository.findOne({ where: { id: aerolinea.id }, relations: ["aeropuertos"] });
    const deletedArtwork: AeropuertoEntity = storedMuseum.aeropuertos.find(a => a.id === artwork.id);

    expect(deletedArtwork).toBeUndefined();

  });

  it('deleteAeropuertoOfAerolinea debería lanzar una excepcion por un aeropuerto inválido', async () => {
    await expect(() => service.deleteAeropuertoOfAerolinea(aerolinea.id, "0")).rejects.toHaveProperty("message", "No se encontró el aeropuerto con el id dado");
  });

  it('deleteAeropuertoOfAerolinea debería lanzar una excepcion por un aeropuerto no asociado a la aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() => service.deleteAeropuertoOfAerolinea("0", aeropuerto.id)).rejects.toHaveProperty("message", "No se encontró la aerolinea con el id dado");
  });

  it('deleteAeropuertoOfAerolinea debería lanzar una excepcion por un aeropuerto no asociado a la aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.word.noun(),
      codigo: faker.word.noun(3),
      pais: faker.name.prefix(),
      ciudad: faker.address.cityName(),
    });

    await expect(() => service.deleteAeropuertoOfAerolinea(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no está asociado con la aerolinea");
  });
});
