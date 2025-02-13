import { XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";

export const defaultNotifyTransactionActions = {
  notifyTransactionWait: ({ transactionHash }: { transactionHash?: string }) => {
    toast.loading(
      () => {
        return (
          <div>
            <div>Waiting on transaction...</div>
            <PolygonscanLink transactionHash={transactionHash} />
          </div>
        );
      },
      { id: "waiting-on-transaction" }
    );
  },
  notifyTransactionSuccess: ({ transactionHash }: { transactionHash?: string }) => {
    toast.dismiss("waiting-on-transaction");
    toast.success(
      (t) => {
        return (
          <>
            <div>
              <div>Transaction complete</div>
              <PolygonscanLink transactionHash={transactionHash} />
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="flex items-center px-3">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </>
        );
      },
      {
        duration: 15000,
      }
    );
  },
  notifyTransactionFailure: () => {
    toast.dismiss("waiting-on-transaction");
    toast.error("Transaction failed");
  },
};

const PolygonscanLink = ({ transactionHash }: { transactionHash?: string }) => {
  if (!transactionHash) return null;
  return (
    <a
      className="text-blue-600"
      target="_blank"
      href={`https://polygonscan.com/tx/${transactionHash}`}
      rel="noreferrer"
    >
      View on polygonscan
    </a>
  );
};
