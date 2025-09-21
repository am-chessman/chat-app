const config = {
    env: {
        AUTH_SECRET: process.env.AUTH_SECRET!,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        DATABASE_URL: process.env.DATABASE_URL,
    },
}

export default config;