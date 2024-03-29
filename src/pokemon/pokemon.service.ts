import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(data: CreatePokemonDto) {
    try {
      return await this.pokemonModel.create(data);
    } catch (error) {
      this.handlerException(error);
    }
  }

  async bulk(data: CreatePokemonDto[]) {
    try {
      return await this.pokemonModel.insertMany(data);
    } catch (error) {
      this.handlerException(error);
    }
  }

  async findAll(data: PaginationDto) {
    const { limit = 3, offset = 0 } = data;

    return await this.pokemonModel.find().limit(limit).skip(offset).sort({
      no: 1,
    });
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });

    // MongoID
    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    // Name
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });

    if (!pokemon)
      throw new NotFoundException(`Pokemon by term ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon: Pokemon = await this.findOne(term);

      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handlerException(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(term);
    // await pokemon.deleteOne();
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0)
      throw new UnprocessableEntityException(`Cannot delete ${id}`);

    return;
  }

  async truncate() {
    return await this.pokemonModel.deleteMany({});
  }

  private handlerException(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon ${JSON.stringify(error.keyValue)} already exists`,
      );

    console.log(error);
    throw new InternalServerErrorException(
      `Cannot create/delete/update Pokemon --check-logs`,
    );
  }
}
