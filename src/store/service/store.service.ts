import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    const { name, about, store_email, owner_id } = createStoreDto;
    const RawData = {
      name,
      about,
      store_email,
      owner: {
        connect: {
          id: owner_id,
        },
      },
    };
    const store = await this.prisma.store.create({
      data: { ...RawData },
    });
    return store;
  }

  async findAll() {
    return await this.prisma.store.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.store.findUniqueOrThrow({ where: { id } });
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const { name, store_email, about } = updateStoreDto;
    const RawData = {
      name,
      about,
      store_email,
    };
    return await this.prisma.store.update({
      where: { id },
      data: { ...RawData },
    });
  }

  async remove(id: string) {
    await this.prisma.store.delete({ where: { id } });
  }

  async saveStoreLogo(store_id: string, imageURL: string) {
    const exisiting_store = await this.findOne(store_id);
    await this.prisma.store.update({
      where: { id: exisiting_store.id },
      data: { logo: imageURL },
    });
  }
}
