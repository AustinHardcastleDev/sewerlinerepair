import path from 'node:path'
import { defineConfig } from 'vitest/config'

const contractorsJson = path.resolve(__dirname, 'lib/data/contractors.json')
const contractorsFixture = path.resolve(
  __dirname,
  'lib/data/contractors.fixture.json',
)

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // Never import the 47 MB extract into Vitest (WindowServer spike).
      [contractorsJson]: contractorsFixture,
    },
  },
})
