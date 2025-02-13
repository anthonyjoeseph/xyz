import { Card } from "~/components/card";
import { Detail, DetailItem } from "~/components/detail";
import { RewardBadge } from "~/components/reward-badge";

export default function ChallengeIdRewards() {
  return (
    <section className="space-y-3 w-full border-spacing-4 border-separate md:w-4/5">
      <Card className="p-6">
        <h3 className="font-medium mb-4">Reward Pool</h3>
        <Detail>
          <DetailItem title="Total rewards to be distributed across winners">
            <RewardBadge amount={20} token="SOL" rMETRIC={100} />
          </DetailItem>
        </Detail>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Your Projected Rewards</h3>
        <Detail>
          <DetailItem title="Estimated avg. rewards based on current claims to submit (may fluctuate)">
            <RewardBadge amount={20} token="SOL" rMETRIC={100} />
          </DetailItem>
        </Detail>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Reward Curve</h3>
        <Detail>
          <DetailItem title="How the reward pool is distributed">
            <div className="flex space-x-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-600 rounded px-1">Aggressive</span>
              <p>Rewards the top 10% of submissions. Winners are determined through peer review</p>
            </div>
          </DetailItem>
        </Detail>
      </Card>
    </section>
  );
}
