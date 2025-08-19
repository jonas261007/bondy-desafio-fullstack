import { GraphQLResolveInfo } from 'graphql';

export const mutationTest = async (
  _parent: any,
  args: { test: string },
  _context: any,
  _info: GraphQLResolveInfo
) => {
  return args.test;
};
