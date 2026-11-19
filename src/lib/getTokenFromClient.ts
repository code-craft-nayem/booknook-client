import { authClient } from "./auth-client";

export const getTokenFromClient = async (): Promise<string | null> => {
  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      return null;
    }

    return data.token;
  } catch {
    return null;
  }
};
