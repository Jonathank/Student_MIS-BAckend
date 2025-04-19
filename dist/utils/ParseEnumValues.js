"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnumValue = parseEnumValue;
function parseEnumValue(enumObj, value) {
    if (!value)
        return undefined;
    const upper = value.toUpperCase();
    return Object.values(enumObj).find((v) => v === upper);
}
//# sourceMappingURL=ParseEnumValues.js.map