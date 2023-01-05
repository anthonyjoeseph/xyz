import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { LaborMarketSchema } from "~/domain";
import { upsertLaborMarket } from "~/services/labor-market.server";
import env from "~/env";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  if (env.DEV_AUTO_INDEX !== "enabled") {
    return json({ error: "Not Allowed" }, { status: 403 });
  }
  const payload = await data.request.json();
  const lm = LaborMarketSchema.parse(payload);
  return json(await upsertLaborMarket(lm));
};
