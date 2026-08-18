import { describe, expect, it } from 'vitest'
import { isSupplyOrRentalOnlyListing } from './listing-eligibility'

describe('isSupplyOrRentalOnlyListing', () => {
  it('flags national rental / supply chains', () => {
    expect(
      isSupplyOrRentalOnlyListing({
        name: 'United Rentals - Power & HVAC',
        categoryName: 'Electric sewer shop',
      }),
    ).toBe(true)
    expect(
      isSupplyOrRentalOnlyListing({
        name: 'Ferguson HVAC Supply',
        categoryName: 'Air conditioning contractor',
      }),
    ).toBe(true)
  })

  it('keeps residential contractors', () => {
    expect(
      isSupplyOrRentalOnlyListing({
        name: 'River City Electric',
        categoryName: 'Electrician',
      }),
    ).toBe(false)
    expect(
      isSupplyOrRentalOnlyListing({
        name: 'Sequachee Valley Propane',
        categoryName: 'Propane supplier',
      }),
    ).toBe(false)
  })
})
