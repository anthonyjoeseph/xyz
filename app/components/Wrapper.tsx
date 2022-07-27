import { useLocation } from "remix";
import type { ReactElement} from "react";
import { useEffect, useState, cloneElement, isValidElement } from "react";
import { useAccount, useDisconnect } from 'wagmi';
import { Buffer } from "buffer";
import Modal from './Modal';
import RewardsHeader from "./RewardsHeader";

export default function Wrapper ({children}: {children?: ReactElement}) {
    let link:string;
    let linkText: string;


    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { data: account } = useAccount();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (account && isOpen) {
            setIsOpen(false);
        }
    }, [account, isOpen])

    // TODO REFACTOR
    if (location.pathname === "/staking") {
        link =  "/claim";
        linkText = "Claim Metric"
    } else if (location.pathname === "/claim") {
        link = "/staking";
        linkText = "Stake Metric";
    } else if (location.pathname === "/question-generation") {
        link = "/all-questions"
        linkText = "View current questions"
    } else {
        link = "/question-generation";
        linkText = "Question Creation"
    }


    if (!window.Buffer) {
        window.Buffer = Buffer;
      }

    return (
        <div>
        <RewardsHeader link={link} linkText={linkText} connectWallet={setIsOpen} account={account} disconnect={disconnect}/>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} selectWallet={true} />
        {isValidElement(children) && cloneElement(children, {setIsOpen, account})}
        </div>
    )
}
