/**
 * Checks if a given string is a valid UUID (Universally Unique Identifier) in the version 4 format.
 * 
 * A valid UUID v4 follows the pattern: 
 * - 8 hexadecimal characters, followed by a hyphen,
 * - 4 hexadecimal characters, followed by a hyphen,
 * - A "4" followed by 3 hexadecimal characters (indicating version 4), followed by a hyphen,
 * - A character in the set [89abAB] followed by 3 hexadecimal characters (indicating the variant),followed by a hyphen,
 * - 12 hexadecimal characters.
 * 
 * @param {string} uuid - The string to be validated as a UUID.
 * @returns {boolean} - Returns `true` if the string is a valid UUID v4, otherwise returns `false`.
 */
function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  return regex.test(uuid);
}

export default isValidUUID;