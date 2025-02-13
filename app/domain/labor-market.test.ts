import { faker } from "@faker-js/faker";
import type { LaborMarketForm } from "./labor-market";
import { LaborMarketFormSchema } from "./labor-market";

describe("LaborMarketFormSchema", () => {
  test("launchAccess 'delegates' requires badger props", () => {
    const laborMarket: LaborMarketForm = {
      title: "Test",
      description: "Test",
      type: "brainstorm",
      submitRepMin: 1,
      submitRepMax: 100,
      rewardCurveAddress: faker.finance.ethereumAddress(),
      reviewBadgerAddress: faker.finance.ethereumAddress(),
      reviewBadgerTokenId: "foo",
      tokenIds: ["1"],
      projectIds: ["1"],
      // @ts-expect-error - so we can simulate a bad input from the client
      launch: {
        access: "delegates",
      },
    };
    const result = LaborMarketFormSchema.safeParse(laborMarket);
    expect(result.success).toBe(false);
    assert(result.success === false);
    expect(result.error.issues.length).toEqual(2);
  });

  test("launchAccess 'delegates' with valid badger props", () => {
    const validLaborMarket: LaborMarketForm = {
      title: "Test",
      description: "Test",
      type: "brainstorm",
      submitRepMin: 1,
      submitRepMax: 100,
      rewardCurveAddress: faker.finance.ethereumAddress(),
      reviewBadgerAddress: faker.finance.ethereumAddress(),
      reviewBadgerTokenId: "foo",
      tokenIds: ["1"],
      projectIds: ["1"],
      launch: {
        access: "delegates",
        badgerAddress: faker.finance.ethereumAddress(),
        badgerTokenId: "1",
      },
    };
    const result = LaborMarketFormSchema.safeParse(validLaborMarket);
    expect(result.success).toBe(true);
  });
});
