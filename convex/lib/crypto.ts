/**
 * Pure-JS SHA-256 implementation for Convex runtime (no Node crypto available).
 * Based on FIPS 180-4 specification.
 */

// Initial hash values (first 32 bits of the fractional parts of the square roots of the first 8 primes)
const H0 = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]

// Round constants (first 32 bits of the fractional parts of the cube roots of the first 64 primes)
const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount))
}

/**
 * Compute SHA-256 hash of a UTF-8 string, returned as hex.
 */
export function sha256(message: string): string {
  // Encode message as UTF-8 bytes
  const msgBytes: number[] = []
  for (let i = 0; i < message.length; i++) {
    const code = message.charCodeAt(i)
    if (code < 0x80) {
      msgBytes.push(code)
    } else if (code < 0x800) {
      msgBytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    } else if (code >= 0xd800 && code <= 0xdbff) {
      // Surrogate pair
      const next = message.charCodeAt(++i)
      const cp = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00)
      msgBytes.push(
        0xf0 | (cp >> 18),
        0x80 | ((cp >> 12) & 0x3f),
        0x80 | ((cp >> 6) & 0x3f),
        0x80 | (cp & 0x3f)
      )
    } else {
      msgBytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    }
  }

  const bitLength = msgBytes.length * 8

  // Padding: append 1 bit, then zeros, then 64-bit big-endian length
  msgBytes.push(0x80)
  while ((msgBytes.length % 64) !== 56) {
    msgBytes.push(0)
  }

  // Append original length as 64-bit big-endian (we only support messages < 2^32 bits)
  msgBytes.push(0, 0, 0, 0)
  msgBytes.push(
    (bitLength >>> 24) & 0xff,
    (bitLength >>> 16) & 0xff,
    (bitLength >>> 8) & 0xff,
    bitLength & 0xff
  )

  // Process each 512-bit (64-byte) block
  const hash = [...H0]

  for (let offset = 0; offset < msgBytes.length; offset += 64) {
    // Create message schedule (64 x 32-bit words)
    const w = new Array<number>(64)

    for (let i = 0; i < 16; i++) {
      const j = offset + i * 4
      w[i] = (msgBytes[j] << 24) | (msgBytes[j + 1] << 16) | (msgBytes[j + 2] << 8) | msgBytes[j + 3]
    }

    for (let i = 16; i < 64; i++) {
      const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0
    }

    // Working variables
    let [a, b, c, d, e, f, g, h] = hash

    // Compression
    for (let i = 0; i < 64; i++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)
      const ch = (e & f) ^ (~e & g)
      const temp1 = (h + S1 + ch + K[i] + w[i]) | 0
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = (S0 + maj) | 0

      h = g
      g = f
      f = e
      e = (d + temp1) | 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) | 0
    }

    hash[0] = (hash[0] + a) | 0
    hash[1] = (hash[1] + b) | 0
    hash[2] = (hash[2] + c) | 0
    hash[3] = (hash[3] + d) | 0
    hash[4] = (hash[4] + e) | 0
    hash[5] = (hash[5] + f) | 0
    hash[6] = (hash[6] + g) | 0
    hash[7] = (hash[7] + h) | 0
  }

  // Convert to hex string
  return hash.map((h) => (h >>> 0).toString(16).padStart(8, "0")).join("")
}

/**
 * Generate a cryptographically secure token as a hex string.
 */
export function randomToken(byteLength = 32): string {
  const cryptoApi = (globalThis as unknown as {
    crypto?: { getRandomValues: (arr: Uint8Array) => Uint8Array }
  }).crypto
  if (!cryptoApi?.getRandomValues) {
    throw new Error("Secure randomness API unavailable")
  }

  const bytes = new Uint8Array(byteLength)
  cryptoApi.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}
