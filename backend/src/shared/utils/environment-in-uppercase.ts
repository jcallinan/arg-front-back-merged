export function getEnvironmentInUppercase(): string {
    return process.env.NODE_ENV?.toUpperCase() || "DEV";
}
