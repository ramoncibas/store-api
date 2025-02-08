// ANSI color codes for styling console output
// This object provides easy-to-use color codes to format log messages with different colors.
// The `reset` property ensures that the color formatting is reset after each message.

const colors = {
  red: "\x1b[31m",   // Red - Used for errors or warnings
  green: "\x1b[32m", // Green - Used for success messages
  blue: "\x1b[34m",  // Blue - Can be used for informational messages
  yellow: "\x1b[33m", // Yellow - Often used for warnings or important notices
  cyan: "\x1b[36m",  // Cyan - Can be used for general logs or debugging
  reset: "\x1b[0m",  // Reset - Resets the text color to default after a message
};


export const { red, green, blue, yellow, cyan, reset } = colors;