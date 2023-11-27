import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon ${JSON.stringify(error.keyValue)} already exists`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        `Cannot create Pokemen --check-logs`,
      );
    }
  }

  async findAll() {
    return await this.pokemonModel.find();
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
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon ${JSON.stringify(error.keyValue)} already exists`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        `Cannot create Pokemen --check-logs`,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
