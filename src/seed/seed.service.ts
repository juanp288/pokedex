import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  private readonly pokeApi = 'https://pokeapi.co/api/v2/pokemon?limit=10';

  constructor(private readonly pokeService: PokemonService) {}

  async seed() {
    const { data } = await this.axios.get<PokeResponse>(this.pokeApi);

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
