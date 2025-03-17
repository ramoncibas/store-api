/**
 * Checks if the given value is a numeric representation.
 * 
 * @param value - The value to be checked for numeric representation.
 * @returns True if the value is numeric, false otherwise.
 */
function isNumeric(value: any): boolean {
  return !isNaN(Number(value)) && isFinite(value);
}

export default isNumeric;
