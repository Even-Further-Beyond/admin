import CharacterTraits from '../data/CharacterTraits';
import Tag from '../data/Tag';

export interface Response {
  totalCharactersCount: number;
  characterTraits: CharacterTraits;
  tags: Tag[];
}

export interface InputProps {
  isSuperUser: boolean;
}
