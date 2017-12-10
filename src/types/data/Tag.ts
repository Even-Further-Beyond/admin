interface Tag {
  id: string;
  name: string;
  description?: string;
  isCategory?: boolean;
  parentId?: string;
  slug?: string;
  fakeId?: number;
  children?: Tag[];
}

export default Tag;
