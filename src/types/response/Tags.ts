import Tag from '../data/Tag';

export interface InputProps {
  createTagMutation: ({}: {}) => Promise<{data: any}>;
  updateTagMutation: ({}: {}) => Promise<{data: any}>;
  deleteTagMutation: ({}: {}) => Promise<{data: any}>;
  isSuperUser: boolean;
}

export interface Response {
  tags: Tag[];
}
