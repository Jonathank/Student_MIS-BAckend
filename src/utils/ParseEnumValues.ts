
export function parseEnumValue<T extends Record<string, string>>(
    enumObj: T,
    value: string | undefined | null
): T[keyof T] | undefined {
    if (!value) return undefined;
    const upper = value.toUpperCase();
    return Object.values(enumObj).find((v) => v === upper) as T[keyof T] | undefined;
}
