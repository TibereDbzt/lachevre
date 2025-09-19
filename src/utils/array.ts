/**
 * Shuffles an array using the Durstenfeld algorithm.
 * @param array The array to shuffle
 * @returns A new shuffled array
 */
export const shuffle = <T>(array: T[]): T[] => {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
