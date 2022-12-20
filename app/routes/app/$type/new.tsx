import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import { useTransition } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { typedjson } from "remix-typedjson";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson/dist/remix";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Button, Container, Error, Modal } from "~/components";
import type { LaborMarketNew, LaborMarketPrepared } from "~/domain";
import { fakeLaborMarketNew, LaborMarketNewSchema } from "~/domain";
import { MarketplaceForm } from "~/features/marketplace-form";
import { useCreateMarketplace } from "~/hooks/use-create-marketplace";
import { useOptionalUser } from "~/hooks/use-user";
import { prepareLaborMarket } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const projects = await listProjects();
  const tokens = await listTokens();
  const defaultValues = url.searchParams.get("fake")
    ? fakeLaborMarketNew()
    : ({ launch: { access: "anyone" } } as const);
  return typedjson({ projects, tokens, defaultValues });
};

const validator = withZod(LaborMarketNewSchema);

type ActionResponse = { preparedLaborMarket: LaborMarketPrepared } | ValidationErrorResponseData;
export const action = async ({ request }: ActionArgs) => {
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const preparedLaborMarket = await prepareLaborMarket(result.data);
  return typedjson({ preparedLaborMarket });
};

export default function CreateMarketplace() {
  const transition = useTransition();
  const { projects, tokens, defaultValues } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();
  const user = useOptionalUser();

  const [modalData, setModalData] = useState<{ laborMarket?: LaborMarketPrepared; isOpen: boolean }>({ isOpen: false });

  function closeModal() {
    setModalData((previousInputs) => ({ ...previousInputs, isOpen: false }));
  }

  useEffect(() => {
    if (actionData && "preparedLaborMarket" in actionData) {
      setModalData({ laborMarket: actionData.preparedLaborMarket, isOpen: true });
    }
  }, [actionData]);

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <ValidatedForm<LaborMarketNew> validator={validator} method="post" defaultValues={defaultValues}>
          <h1 className="text-3xl font-semibold antialiased">Create Challenge Marketplace</h1>
          <MarketplaceForm projects={projects} tokens={tokens} />
          <input type="hidden" name="userAddress" value={user?.address} />
          <Error name="userAddress" />
          <div className="flex space-x-4 mt-6">
            <Button size="lg" type="submit">
              {transition.state === "submitting" ? "Loading..." : "Next"}
            </Button>
          </div>
        </ValidatedForm>
      </div>
      <Modal title="Create Marketplace?" isOpen={modalData.isOpen} onClose={closeModal}>
        <ConfirmTransaction laborMarket={modalData.laborMarket} onClose={closeModal} />
      </Modal>
    </Container>
  );
}

function ConfirmTransaction({ laborMarket, onClose }: { laborMarket?: LaborMarketPrepared; onClose: () => void }) {
  invariant(laborMarket, "laborMarket is required"); // this should never happen but just in case

  const { write, isLoading } = useCreateMarketplace({
    data: laborMarket,
    onTransactionSuccess() {
      toast.dismiss("creating-marketplace");
      toast.success("Marketplace created!");
    },
    onWriteSuccess() {
      toast.loading("Creating marketplace...", { id: "creating-marketplace" });
      onClose();
    },
  });

  const onCreate = () => {
    write?.();
  };

  return (
    <div className="space-y-8">
      <p>Please confirm that you would like to create a new marketplace.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Button size="md" type="button" onClick={onCreate} loading={isLoading}>
          Create
        </Button>
        <Button variant="cancel" size="md" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
