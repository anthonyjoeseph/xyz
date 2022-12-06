import { UserBadge } from "~/components/UserBadge";
import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import { Link, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useCallback, useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import type { DataFunctionArgs, UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Avatar } from "~/components/avatar";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/button";
import { Card } from "~/components/Card";
import { ValidatedCombobox } from "~/components/combobox";
import { Container } from "~/components/Container";
import { Countdown } from "~/components/countdown";
import { ValidatedInput } from "~/components/input/input";
import { Pagination } from "~/components/Pagination";
import { ProjectAvatar } from "~/components/avatar";
import { Header, Row, Table } from "~/components/table";
import { ValidatedSelect } from "~/components/select";
import { Tabs } from "~/components/Tabs";
import { ChallengeSearchSchema } from "~/domain/challenge";
import { countChallenges, searchChallenges } from "~/services/challenges-service.server";
import { findLaborMarket } from "~/services/labor-market.server";
import { Checkbox } from "~/components/checkbox";
import { Detail, DetailItem } from "~/components/detail";
import { Field, Label } from "~/components/field";
import type { LaborMarket } from "@prisma/client";

const validator = withZod(ChallengeSearchSchema);

export const loader = async (data: DataFunctionArgs) => {
  const url = new URL(data.request.url);
  const params = getParamsOrFail(url.searchParams, ChallengeSearchSchema);

  if (params.laborMarket == undefined) {
    params.laborMarket = data.params.id;
  }

  let laborMarket = undefined;

  if (data.params.id != undefined) {
    laborMarket = await findLaborMarket(data.params.id);
  }

  const challenges = await searchChallenges(params);
  const totalResults = await countChallenges(params);
  return typedjson({ challenges, totalResults, params, laborMarket });
};

export default function MarketplaceChallenges() {
  const { laborMarket, challenges } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16">
      <div className="mx-auto container mb-12 px-10">
        <section className="flex flex-wrap gap-5 justify-between pb-5">
          <h1 className="text-3xl font-semibold">{laborMarket?.title} </h1>
          <div className="flex flex-wrap gap-5">
            <Button asChild className="mx-auto radius-md">
              <Link to={`/app/brainstorm/${laborMarket?.address}/c/new`}>Launch Challenge</Link>
            </Button>
          </div>
        </section>
        <section className="flex flex-col space-y-7 pb-12">
          <div className="flex flex-wrap gap-x-8">
            <Detail>
              {/*<DetailItem title="Sponser">
               <UserBadge />
              </DetailItem>
              <DetailItem title="Chain/Project">
                {laborMarket?.projects?.map((p) => (
                  <Badge key={p.slug} className="pl-2">
                    <ProjectAvatar project={p} />
                    <span className="mx-1">{p.name}</span>
                  </Badge>
                ))}
                </DetailItem>*/}
            </Detail>
          </div>
          <p className="max-w-2xl text-gray-500 text-sm">{laborMarket?.description}</p>
        </section>

        <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
          <main className="flex-1">
            <Tabs>
              <Tabs.List>
                <Tabs.Tab> {`Challenges (${challenges.length})`} </Tabs.Tab>
                <Tabs.Tab> Prerequisites </Tabs.Tab>
                <Tabs.Tab> Rewards </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panels>
                <Tabs.Panel>
                  <WrappedMarketplacesChallengesTable />
                </Tabs.Panel>
                <Tabs.Panel>
                  <Prerequisites laborMarket={laborMarket} />
                </Tabs.Panel>
                <Tabs.Panel>
                  <Rewards />
                </Tabs.Panel>
              </Tabs.Panels>
            </Tabs>
          </main>
        </section>
      </div>
    </Container>
  );
}

function SearchAndFilter() {
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  return (
    <ValidatedForm
      formRef={formRef}
      method="get"
      validator={validator}
      onChange={handleChange}
      className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-brand-400 bg-opacity-5"
    >
      <ValidatedInput
        placeholder="Search"
        name="q"
        size="sm"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      />
      <h3 className="font-semibold">Sort:</h3>
      <ValidatedSelect
        placeholder="Select option"
        name="sortBy"
        size="sm"
        options={[
          { label: "Title", value: "title" },
          { label: "Submit Deadline", value: "submit" },
          { label: "Review Deadline", value: "review" },
          { label: "Reward Pool", value: "reward" },
        ]}
      />
      <h3 className="font-semibold">Filter:</h3>
      <p>I am able to:</p>
      <Checkbox id="submit_checkbox" name="permission" value="submit" label="Submit" />
      <Checkbox id="review_checkbox" name="permission" value="review" label="Review" />
      <Field>
        <Label>Reward Token</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="reward"
          size="sm"
          options={[
            { label: "Solana", value: "Solana" },
            { label: "Ethereum", value: "Ethereum" },
            { label: "USD", value: "USD" },
          ]}
        />
      </Field>
      <Field>
        <Label>Chain/Project</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="project"
          size="sm"
          options={[
            { label: "Solana", value: "Solana" },
            { label: "Ethereum", value: "Ethereum" },
          ]}
        />
      </Field>
      <Field>
        <Label>Language</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="language"
          size="sm"
          options={[{ label: "English", value: "English" }]}
        />
      </Field>
    </ValidatedForm>
  );
}

function Prerequisites({ laborMarket }: { laborMarket: LaborMarket | null | undefined }) {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate">
            <div className="space-y-4 md:w-4/5">
              <p className="text-sm text-gray-500">
                What you must hold in your connected wallet to perform various actions on challenges in this challenge
                marketplace
              </p>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this much rMETRIC to enter submissions on challenges
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 mb-2">MIN BALANCE</div>
                    <Badge>
                      <div className="normal-case">{laborMarket.submitRepMin} rMETRIC</div>
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 mb-2">MAX BALANCE</div>
                    <Badge>
                      <div className="normal-case">{laborMarket.submitRepMax} rMETRIC</div>
                    </Badge>
                  </div>
                </div>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this badge to review and score submissions on challenges
                </p>
                <div className="text-xs text-gray-500">MDAO S4 REVIEWER BADGE</div>
                <div className="flex gap-2">
                  <Avatar />
                  <div className="text-base text-[#252525]">{laborMarket.reviewBadgerAddress}</div>
                </div>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this badge to launch new challenges
                </p>
                <div className="text-xs text-gray-500">MDAO S4 CONTRIBUTOR BADGE</div>
                <div className="flex gap-2">
                  <Avatar />
                  <div className="text-base text-[#252525]">{laborMarket.launchBadgerAddress}</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

function Rewards() {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate space-y-4 md:w-4/5">
            <p className="text-sm text-gray-500">
              How rewards are distributed for all challenges in this challenge marketplace and how liquid it currently
              is
            </p>
            <Card className="p-4 space-around space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Challenge Pools Total</p>
              <p className="text-xs text-gray-500">SUM OF ALL ACTIVE CHALLENGE REWARD POOLS</p>
              <Badge className="bg-gray-200">
                <Badge className="bg-gray-100">100 USD</Badge> 500 rMETRIC
              </Badge>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Avg. Challenge Pool</p>
              <p className="text-xs text-gray-500">
                AVERAGE REWARD POOL VALUE FOR ACTIVE CHALLENGES IN THIS CHALLENGE MARKETPLACE
              </p>
              <Badge className="bg-gray-200">
                <Badge className="bg-gray-100">100 USD</Badge> 500 rMETRIC
              </Badge>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Reward Curve</p>
              <p className="text-xs text-gray-500">HOW ALL CHALLENGE REWARD POOLS ARE DISTRIBUTED</p>
              <div className="flex flex-row space-x-3 mt-1">
                <Badge>Aggresive</Badge>
                <p className="text-xs">
                  Rewards the top 10% of submissions for each challenge. Winners are determined through peer review
                </p>
              </div>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Reward Tokens</p>
              <p className="text-xs text-gray-500">TOKENS YOU CAN EARN IN THIS CHALLENGE MARKETPLACE</p>
              <p className="flex flex-row space-x-3 mt-1">{/* <TokenBadge slug="Solana" /> */}</p>
            </Card>
          </div>
        </div>
      </main>
    </section>
  );
}

type MarketplaceChallengesTableProps = {
  challenges: UseDataFunctionReturn<typeof loader>["challenges"];
};

function MarketplacesChallengesTable({ challenges }: MarketplaceChallengesTableProps) {
  return (
    <Table>
      <Header columns={6} className="mb-2">
        <Header.Column span={2}>Challenge</Header.Column>
        <Header.Column>Chain/Project</Header.Column>
        <Header.Column>Reward Pool</Header.Column>
        <Header.Column>Submit Deadline</Header.Column>
        <Header.Column>Review Deadline</Header.Column>
      </Header>
      {challenges.map((c) => {
        return (
          <Row asChild columns={6} key={c.id}>
            <Link to={`/app/brainstorm/c/${c.id}`} className="text-sm font-medium">
              <Row.Column span={2}>{c.title}</Row.Column>
              <Row.Column>
                <div className="flex">
                  <div>
                    {c.laborMarket.projects?.map((p) => (
                      <Badge key={p.slug} className="pl-2">
                        <ProjectAvatar project={p} />
                        <span className="mx-1">{p.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </Row.Column>

              <Row.Column>5 Sol</Row.Column>
              <Row.Column>
                <Countdown date={"2023-01-25"} />
              </Row.Column>
              <Row.Column>
                <Countdown date={"2022-11-25"} />
              </Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function MarketplacesChallengesCard({ challenges }: MarketplaceChallengesTableProps) {
  return (
    <div className="space-y-4">
      {challenges.map((c) => {
        return (
          <Card asChild key={c.id}>
            <Link to={`/app/brainstorm/c/${c.id}`} className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5">
              <div>Challenges</div>
              <div className="text-sm font-medium">{c.title}</div>

              <div>Chain/Project</div>
              <div className="flex">
                <div>
                  {c.laborMarket.projects?.map((p) => (
                    <Badge key={p.slug} className="pl-2">
                      <ProjectAvatar project={p} />
                      <span className="mx-1">{p.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>Reward Pool</div>
              <div>5 Sol</div>
              <div>Submit Deadline</div>
              <div className="text-gray-500 text-sm">
                <Countdown date={"2023-01-25"} />
              </div>
              <div>Review Deadline</div>
              <div className="text-gray-500 text-sm">
                <Countdown date={"2022-11-25"} />
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}

function WrappedMarketplacesChallengesTable() {
  const { totalResults, params, challenges } = useTypedLoaderData<typeof loader>();

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <ChallengesListView challenges={challenges} />
          <div className="w-fit m-auto">
            <Pagination page={params.page} totalPages={Math.ceil(totalResults / params.first)} />
          </div>
        </div>
      </main>
      <aside className="md:w-1/5">
        <SearchAndFilter />
      </aside>
    </section>
  );
}

function ChallengesListView({ challenges }: MarketplaceChallengesTableProps) {
  if (challenges.length === 0) {
    return <p>No results. Try changing search and filter options.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <MarketplacesChallengesTable challenges={challenges} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <MarketplacesChallengesCard challenges={challenges} />
      </div>
    </>
  );
}
