import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";
import { validateDate, validateTime } from "~/utils/date";
import { parseTokenAmount } from "~/utils/helpers";
import { EvmAddressSchema } from "./address";

export const ServiceRequestSchema = z.object({
  id: z.string({ description: "The id of the service request." }),
  title: z.string({ description: "The title of the service request." }).min(1, "Required"),
  description: z.string({ description: "The description of the service request." }).min(1, "Required"),
  laborMarketAddress: EvmAddressSchema,
  createdAt: z.date({ description: "The date the service request was created." }),
});

const DateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

const TokenAmountSchema = z.string().refine((r) => {
  try {
    parseTokenAmount(r);
    return true;
  } catch (e) {
    return false;
  }
}, "Invalid amount");

const InputDateSchema = z.string().refine((d) => {
  return validateDate(d);
});

const InputTimeSchema = z.string().refine((t) => {
  return validateTime(t);
});

export const ServiceRequestFormSchema = ServiceRequestSchema.pick({ title: true, description: true }).extend({
  language: z.enum(["english", "spanish"]),
  projects: z.enum(["ethereum", "solana"]),
  startDate: InputDateSchema,
  startTime: InputTimeSchema,
  endDate: InputDateSchema,
  endTime: InputTimeSchema,
  reviewEndDate: InputDateSchema,
  reviewEndTime: InputTimeSchema,
  rewardToken: EvmAddressSchema,
  rewardPool: TokenAmountSchema,
});

export const ServiceRequestContractSchema = ServiceRequestSchema.pick({
  // Metadata needed for DEV_AUTO_INDEX
  title: true,
  description: true,
  laborMarketAddress: true,
}).extend({
  pTokenAddress: EvmAddressSchema,
  pTokenQuantity: TokenAmountSchema,
  signalExpiration: DateSchema,
  submissionExpiration: DateSchema,
  enforcementExpiration: DateSchema,
  uri: z.string(),
});

// Generate a fake Service Request for testing using faker.
export function fakeServiceRequestFormData(): ServiceRequestForm {
  const startDate = faker.date.soon();
  const reviewDate = faker.date.future();
  const endDate = faker.date.between(startDate, reviewDate);

  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraphs(2),
    language: "english",
    projects: "ethereum",
    startDate: dayjs(startDate).format("YYYY-MM-DD"),
    startTime: dayjs(startDate).format("HH:mm"),
    endDate: dayjs(endDate).format("YYYY-MM-DD"),
    endTime: dayjs(endDate).format("HH:mm"),
    reviewEndDate: dayjs(reviewDate).format("YYYY-MM-DD"),
    reviewEndTime: dayjs(reviewDate).format("HH:mm"),
    rewardToken: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    rewardPool: "0.000000000000000001",
  };
}

export const ServiceRequestSearchSchema = z.object({
  page: z.number().default(1),
  laborMarket: z.string().optional(),
  q: z.string().optional(),
  sortBy: z.enum(["title"]).default("title"),
  order: z.enum(["asc", "desc"]).default("desc"),
  token: z.string().optional(),
  project: z.string().optional(),
  first: z.number().default(12),
});

export const ServiceRequestIndexerSchema = ServiceRequestContractSchema.extend({
  contractId: z.string(),
});

export type ServiceRequest = z.infer<typeof ServiceRequestSchema>;
export type ServiceRequestForm = z.infer<typeof ServiceRequestFormSchema>;
export type ServiceRequestContract = z.infer<typeof ServiceRequestContractSchema>;
export type ServiceRequestSearch = z.infer<typeof ServiceRequestSearchSchema>;
export type ServiceRequestIndexer = z.infer<typeof ServiceRequestIndexerSchema>;
