export const auth = {
  api: {
    getSession: async () => null,
  },
};
export const betterAuth = () => auth;
export const prismaAdapter = () => ({ provider: 'postgresql' });
export const fromNodeHeaders = (headers: unknown) => headers;
