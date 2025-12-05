export const AUTH_RULES = {
  USERNAME: { MIN: 3, MAX: 20 },
  PASSWORD: { MIN: 6 },
  EMAIL: { MAX: 100 }
} as const;