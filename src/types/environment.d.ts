export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string,
            DB_KEY: string,
            IS_DEVOLOPMENT: boolean
        }
    }
}