import { useControlField } from "remix-validated-form";
import { ValidatedInput } from "../../components/input/input";
import { ValidatedTextarea } from "../../components/textarea/textarea";
import { ValidatedSelect } from "~/components/select";
import { ValidatedCombobox } from "../../components/combobox/combobox";
import type { Project, Token } from "@prisma/client";
import { Error, Field, Label } from "../../components/field";
import { Button } from "../../components/button";
import { useParams } from "@remix-run/react";

export function MarketplaceForm({ projects, tokens }: { projects: Project[]; tokens: Token[] }) {
  const [launchAccess] = useControlField("launch.access");
  const { mType } = useParams();

  return (
    <div className="space-y-10 py-5">
      {mType === "brainstorm" ? <BrainstormDescription /> : <AnalyticsDescription />}
      <input type="hidden" name="type" value={mType} />
      <Field>
        <Label size="lg">Challenge Marketplace Title</Label>
        <ValidatedInput type="text" name="title" placeholder="e.g Solana Breakpoint 2023" />
        <Error name="title" />
      </Field>

      <Field>
        <Label size="lg">Details</Label>
        <ValidatedTextarea
          name="description"
          placeholder={
            mType === "brainstorm"
              ? "What’s the goal of this Brainstorm marketplace?"
              : "What’s the goal of this Analytics marketplace?"
          }
          rows={7}
        />
        <Error name="description" />
      </Field>

      <Field>
        <Label size="lg">Blockchain/Project(s)</Label>
        <ValidatedCombobox
          placeholder="e.g Ethereum, Solana, etc..."
          name="projectIds"
          options={projects.map((p) => ({ label: p.name, value: p.id }))}
        />
        <Error name="projectIds" />
      </Field>

      <section className="space-y-4">
        <Field>
          <div className="flex items-center">
            <Label size="lg" className="mr-auto">
              Who has permission to launch challenges?
            </Label>
            <p className="flex text-sm space-x-3">
              <Button variant="link" size="none" asChild>
                <a href="https://www.trybadger.com/" target="_blank" rel="noreferrer">
                  Launch Badger
                </a>
              </Button>
              <Button variant="link" size="none" asChild>
                <a href="https://flipside-crypto.gitbook.io/badger/what-is-badger" target="_blank" rel="noreferrer">
                  Badger Docs
                </a>
              </Button>
            </p>
          </div>
          <ValidatedSelect
            name="launch.access"
            options={[
              { label: "Anyone", value: "anyone" },
              { label: "Delegates only", value: "delegates" },
            ]}
          />
          <Error name="launchAccess" />
        </Field>

        {launchAccess === "delegates" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <Label>Badger Contract Address</Label>
              <ValidatedInput name="launch.badgerAddress" />
              <Error name="launch.badgerAddress" />
            </Field>
            <Field>
              <Label>Badger Token ID</Label>
              <ValidatedInput name="launch.badgerTokenId" />
              <Error name="launch.badgerTokenId" />
            </Field>
          </div>
        ) : null}
      </section>

      <section>
        <Label size="lg">Challenge Rewards</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <Label>Token</Label>
            <ValidatedCombobox name="tokenIds" options={tokens.map((t) => ({ value: t.id, label: t.name }))} />
            <Error name="tokenIds" />
          </Field>
          <Field>
            <Label>Reward Curve</Label>
            <ValidatedSelect name="rewardCurveAddress" options={[{ value: "linear", label: "Linear" }]} />
            <Error name="rewardCurveAddress" />
          </Field>
        </div>
      </section>

      <section>
        <h4 className="font-semibold mb-4">Control who has permission to submit on challenges</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <Label>Minimum rMETRIC Balance</Label>
            <ValidatedInput name="submitRepMin" />
            <Error name="submitRepMin" />
          </Field>
          <Field>
            <Label>Maximum rMETRIC Balance</Label>
            <ValidatedInput name="submitRepMax" />
            <Error name="submitRepMax" />
          </Field>
        </div>
      </section>

      <Field>
        <Label size="lg">Control who has permission to review challenge submissions</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <Label>Reviewer Badger Contract Address</Label>
            <ValidatedInput type="text" name="reviewBadgerAddress" placeholder="0x..." />
            <Error name="reviewBadgerAddress" />
          </Field>
          <Field>
            <Label>Reviewer Badger Token ID</Label>
            <ValidatedInput type="text" name="reviewBadgerTokenId" />
            <Error name="reviewBadgerTokenId" />
          </Field>
        </div>
      </Field>
    </div>
  );
}

function AnalyticsDescription() {
  return (
    <section className="space-y-1">
      <p className="text-cyan-500 text-lg">
        Tap the world’s best Web3 analyst community to deliver quality analytics, tooling, or content that helps
        projects launch, grow and succeed.
      </p>
      <p className="text-sm text-gray-500">
        Define user permissions, blockchain/project and reward token allowlists, and the reward curve. These parameters
        will be applied to all challenges in this marketplace.
      </p>
    </section>
  );
}

function BrainstormDescription() {
  return (
    <section className="space-y-1">
      <p className="text-cyan-500 text-lg">
        Source and prioritize questions, problems, or tooling needs for Web3 analysts to address.
      </p>
      <p className="text-sm text-gray-500">
        Define user permissions, blockchain/project and reward token allowlists, and the reward curve. These parameters
        will be applied to all challenges in this marketplace.
      </p>
    </section>
  );
}
