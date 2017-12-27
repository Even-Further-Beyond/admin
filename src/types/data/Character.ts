import Gender from './Gender';
import HairLength from './HairLength';
import Color from './Color';
import AgeGroup from './AgeGroup';
import Tag from './Tag';

interface Image {
  imagePath: string;
}

interface Character {
  id: string;
  malId: number;
  name: string;
  alternativeNames?: string[];
  ageStart?: number;
  ageEnd?: number;
  heightStart?: number;
  heightEnd?: number;
  weightStart?: number;
  weightEnd?: number;
  gender?: Gender;
  hairLength?: HairLength;
  eyeColors?: Color[];
  hairColors?: Color[];
  ageGroups?: AgeGroup[];
  tags?: Tag[];
  image: Image;
  images: Image[];
  createdAt?: string;
  updatedAt?: string;
}

export default Character;
