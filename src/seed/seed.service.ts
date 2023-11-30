import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  private readonly pokeApi = 'https://pokeapi.co/api/v2/pokemon?limit=10';

  constructor(
    private readonly pokeService: PokemonService,
    private readonly axiosAdapter: AxiosAdapter,
  ) {}

  async seed() {
    const data = await this.axiosAdapter.get<PokeResponse>(this.pokeApi);

    await this.pokeService.truncate();

    const inserts = data.results.map(({ name, url }) => {
      let segments = url.split('/');
      let no = +segments[segments.length - 2];

      return { name, no };
    });

    await this.pokeService.bulk(inserts);

    return;
  }
}
