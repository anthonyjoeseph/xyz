import { DocumentDuplicateIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ValidatedForm } from "remix-validated-form";
import { useRef } from "react";
import { ValidatedCombobox } from "~/components/combobox";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input";
import { Link, useSubmit } from "@remix-run/react";
import { Checkbox } from "~/components/checkbox";
import { withZod } from "@remix-validated-form/with-zod";
import { LaborMarketSearchSchema } from "~/domain";
import { ValidatedSelect } from "~/components/select";
import { Header, Row, Table } from "~/components/table";
import { Badge } from "~/components/badge";
import { fromNow } from "~/utils/date";
import { CopyToClipboard } from "~/components/copy-to-clipboard";
import { Card } from "~/components/card";
import { truncateAddress } from "~/utils/helpers";

//change
const validator = withZod(LaborMarketSearchSchema);

export default function Showcase() {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1 space-y-10">
        <div className="space-y-3">
          <p className="text-lg font-semibold">Top Submissions</p>
          <hr className="bg-gray-200" />
          <SubmissionsListView />
          <p className="text-md text-stone-500">{"View {count} more"}</p>
        </div>
        <div className="space-y-3">
          <p className="text-lg font-semibold">Top rMETRIC holders</p>
          <hr className="bg-gray-200" />
          <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
            <p className="py-20 mx-auto">Totally a chart</p>
          </div>
          <RMETRICHoldersListView />
          <p className="text-md text-stone-500">{"View {count} more"}</p>
        </div>
        <div className="space-y-3">
          <p className="text-lg font-semibold">Top Particpants</p>
          <hr className="bg-gray-200" />
          <div className="flex flex-col md:flex-row gap-5">
            <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
              <p className="py-20 mx-auto">Totally a chart</p>
            </div>
            <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
              <p className="py-20 mx-auto">Totally a chart</p>
            </div>
          </div>
          <ParticipantsListView />
          <p className="text-md text-stone-500">{"View {count} more"}</p>
        </div>
      </main>
      <aside className="md:w-1/4 lg:w-1/5 pt-11">
        <SearchAndFilter />
      </aside>
    </section>
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
      noValidate
      validator={validator}
      onChange={handleChange}
      className="space-y-3 p-4 border border-gray-300/50 rounded-lg bg-blue-300 bg-opacity-5 text-sm sticky top-0"
    >
      <ValidatedInput
        placeholder="Search address"
        name="q"
        size="sm"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      />

      <h3 className="font-semibold">Filter</h3>
      <Checkbox name="flow" label="Analyze" value="analyze" />
      <Checkbox name="flow" label="Brainstorm" value="brainstorm" />

      <Field>
        <Label>Chain/Project</Label>
        <ValidatedCombobox name="project" onChange={handleChange} placeholder="Select option" size="sm" options={[]} />
      </Field>

      <Field>
        <Label>Score</Label>
        <ValidatedCombobox name="score" size="sm" onChange={handleChange} placeholder="Select option" options={[]} />
      </Field>

      <Field>
        <Label>Timeframe</Label>
        <ValidatedSelect name="timeframe" size="sm" onChange={handleChange} placeholder="Select option" options={[]} />
      </Field>

      <Field>
        <Label>Marketplace</Label>
        <ValidatedCombobox
          name="marketplace"
          size="sm"
          onChange={handleChange}
          placeholder="Select option"
          options={[]}
        />
      </Field>
    </ValidatedForm>
  );
}

function SubmissionsListView() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <SubmissionsTable />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <SubmissionsCard />
      </div>
    </>
  );
}

function RMETRICHoldersListView() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <RMETRICHoldersTable />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <RMETRICHoldersCard />
      </div>
    </>
  );
}

function ParticipantsListView() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <ParticpantsTable />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <ParticipantsCard />
      </div>
    </>
  );
}

function SubmissionsTable() {
  const w = { address: "0x364875845389cl1hny43i8" };

  return (
    <Table>
      <Header columns={12} className="mb-2 pt-2 text-sm text-stone-500">
        <Header.Column span={3}>Title</Header.Column>
        <Header.Column span={2}>User rMETRIC</Header.Column>
        <Header.Column span={3}>Challenge</Header.Column>
        <Header.Column span={2}>Chain/Project</Header.Column>
        <Header.Column>Submitted</Header.Column>
      </Header>
      {[1, 2, 3, 4].map((s) => {
        return (
          <Row asChild columns={12} key={"s.contractId"}>
            {/*<Link to={`/app/${s.serviceRequest.laborMarket.type}/sr/s.contractId`} className="text-sm text-stone-500">*/}
            <Row.Column span={3}>
              <div className="flex flex-wrap gap-1">
                {"s.title"}
                <img alt="" src="/img/trophy.svg" width={15} />
                <p className="text-neutral-400 font-thin">({"scoreNumtoLabel(s.score)"})</p>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <img alt="" src="/img/icons/poly.svg" width={15} />
                <CopyToClipboard
                  className="text-stone-500"
                  content={truncateAddress(w.address)}
                  iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                />
              </div>
            </Row.Column>
            <Row.Column span={2}>
              <Badge>400 rMETRIC</Badge>
            </Row.Column>
            <Row.Column span={3}>s.serviceRequest.title</Row.Column>
            <Row.Column span={2}>
              {/*<div className="flex items-center gap-2 flex-wrap">
      {m.projects.map((p) => (
        <Badge key={p.slug} className="pl-2">
          <ProjectAvatar project={p} />
          <span className="mx-1">{p.name}</span>
        </Badge>
      ))}
      </div>*/}
            </Row.Column>
            <Row.Column span={2}>{fromNow("11-22-21")}</Row.Column>
            {/*</Link>*/}
          </Row>
        );
      })}
    </Table>
  );
}

function SubmissionsCard() {
  const w = { address: "0x364875845389cl1hny43i8" };

  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((s) => {
        return (
          <Card asChild key={"s.contractId"}>
            {/* <Link
              to={`/app/${s.serviceRequest.laborMarket.type}/sr/s.contractId`}
              className="text-sm text-stone-500 grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5"
        >*/}
            <div className="col-span-2">
              <div className="flex gap-1">
                {"s.title"}
                <img alt="" src="/img/trophy.svg" width={15} />
                <p className="text-neutral-400 font-thin">({"scoreNumToLabel(s.score)"})</p>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <img alt="" src="/img/icons/poly.svg" width={15} />
                <CopyToClipboard
                  className="text-stone-500"
                  content={truncateAddress(w.address)}
                  iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                />
              </div>
            </div>
            <p>User rMETRIC</p>
            <Badge>400 rMETRIC</Badge>
            <p>Challenge</p>
            <p>s.serviceRequest.title</p>
            <p>Chain/Project</p>
            <div className="flex items-center gap-2 flex-wrap">
              {/*{m.projects.map((p) => (
        <Badge key={p.slug} className="pl-2">
          <ProjectAvatar project={p} />
          <span className="mx-1">{p.name}</span>
        </Badge>
      ))}*/}
              todo
            </div>
            <p>Submitted</p>
            {fromNow("11-21-22")}
            {/*</Link>*/}
          </Card>
        );
      })}
    </div>
  );
}

function RMETRICHoldersTable() {
  return (
    <Table>
      <Header columns={6} className="mb-2 pt-2 text-sm text-stone-500">
        <Header.Column span={4}>Address</Header.Column>
        <Header.Column>% of Supply</Header.Column>
        <Header.Column>Balance</Header.Column>
      </Header>
      {[1, 2].map((p) => {
        return (
          <Row asChild columns={6} key={p}>
            <Link to={`/app/u/${p}`} className="text-sm font-medium text-stone-500">
              <Row.Column span={4} className="flex flex-row items-center gap-x-2">
                <img alt="" src="/img/icons/poly.svg" />
                <CopyToClipboard
                  className="text-stone-500"
                  content={"0xb794f5ea0ba39494ce839613cccba74279579268"}
                  iconRight={<DocumentDuplicateIcon className="ml-0.5 w-5 h-5" />}
                />
              </Row.Column>
              <Row.Column>11.82%</Row.Column>
              <Row.Column>
                <Badge>400 rMETRIC</Badge>
              </Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function RMETRICHoldersCard() {
  const w = { address: "0xb794f5ea0ba39494ce839613cccba74279579268" };

  return (
    <div className="space-y-4">
      {[1, 2, 3].map((p) => {
        return (
          <Card key={p} className="px-4 py-5">
            <Link to={`/app/u/${p}`} className="text-sm font-medium text-stone-500 space-y-3">
              <div className="flex flex-row items-center gap-x-2 col-span-2">
                <img alt="" src="/img/icons/poly.svg" />
                <CopyToClipboard
                  className="text-stone-500"
                  content={truncateAddress(w.address)}
                  iconRight={<DocumentDuplicateIcon className="ml-0.5" />}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-y-2">
                <div className="flex items-center gap-2">
                  <p>User rMETRIC</p>
                  <Badge>400 rMETRIC</Badge>
                </div>
                <p>{"% of Supply: {todo}"}</p>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}

function ParticpantsTable() {
  const w = { address: "0xb794f5ea0ba39494ce839613cccba74279579268" };

  return (
    <Table>
      <Header columns={6} className="mb-2 pt-2 text-sm text-stone-500">
        <Header.Column span={1}>Address</Header.Column>
        <Header.Column span={1}>rMETRIC</Header.Column>
        <Header.Column span={1}>Challenges Launched</Header.Column>
        <Header.Column span={1}>Challenges Won</Header.Column>
        <Header.Column span={1}>Tokens Funded</Header.Column>
        <Header.Column span={1}>Tokens Claimed</Header.Column>
      </Header>
      {[1, 2].map((p) => {
        return (
          <Row asChild columns={6} key={p}>
            <Link to={`/app/type/c/${p}`} className="text-sm font-medium text-stone-500">
              <Row.Column span={1} className="flex flex-row items-center gap-x-2">
                <img alt="" src="/img/icons/poly.svg" />
                <CopyToClipboard className="text-stone-500" content={truncateAddress(w.address)} />
              </Row.Column>
              <Row.Column span={1}>
                <Badge>400 rMETRIC</Badge>
              </Row.Column>
              <Row.Column span={1} className="text-center">
                70
              </Row.Column>
              <Row.Column span={1} className="text-center">
                22
              </Row.Column>
              <Row.Column span={1} className="flex gap-1 items-center">
                <img src="/img/icons/dollar.svg" alt="" />
                73248
              </Row.Column>
              <Row.Column span={1} className="flex gap-1 items-center">
                <img src="/img/icons/dollar.svg" alt="" />
                73248
              </Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function ParticipantsCard() {
  const w = { address: "0xb794f5ea0ba39494ce839613cccba74279579268" };

  return (
    <div className="space-y-4">
      {[1, 2].map((p) => {
        return (
          <Card asChild key={p}>
            <Link
              to={`/app/u/${p}`}
              className="text-sm font-medium text-stone-500 grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5"
            >
              <div className="flex flex-row items-center gap-x-2 col-span-2">
                <img alt="" src="/img/icons/poly.svg" />
                <CopyToClipboard
                  className="text-stone-500"
                  content={truncateAddress(w.address)}
                  iconRight={<DocumentDuplicateIcon className="ml-0.5 w-5 h-5" />}
                />
              </div>
              <p>User rMETRIC</p>
              <Badge>400 rMETRIC</Badge>
              <p>Challenges Launched</p>
              <p>70</p>
              <p>Challenges Won</p>
              <p>22</p>
              <p>Tokens Funded</p>
              <div className="flex gap-1 items-center">
                <img src="/img/icons/dollar.svg" alt="" />
                73248
              </div>
              <p>Tokens Claimed</p>
              <div className="flex gap-1 items-center">
                <img src="/img/icons/dollar.svg" alt="" />
                73248
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
