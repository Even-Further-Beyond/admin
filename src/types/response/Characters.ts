import Character from '../data/Character';
import CharacterTraits from '../data/CharacterTraits';
import Tag from '../data/Tag';

export interface Response {
  characters: Character[];
}

export interface InputProps {
  offset: number;
  limit: number;
  characterTraits: CharacterTraits;
  tags: Tag[];
  isSuperUser: boolean;
}
