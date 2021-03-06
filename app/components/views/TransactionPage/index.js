import TransactionPage from "./Page";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { DecredLoading } from "indicators";
import { useMachine } from "@xstate/react";
import { useState } from "react";
import { StandalonePage } from "layout";
import * as ta from "actions/TransactionActions";
import * as ca from "actions/ClientActions";
import * as sel from "selectors";

function Transaction() {
  const { txHash } = useParams();
  const dispatch = useDispatch();
  const abandonTransaction = () => dispatch(ca.abandonTransaction(txHash));
  const decodeRawTransactions = (hexTx) =>
    dispatch(ta.decodeRawTransaction(hexTx, txHash));
  const getAmountFromTxInputs = (decodedTx) =>
    dispatch(ta.getAmountFromTxInputs(decodedTx));
  const decodedTransactions = useSelector(sel.decodedTransactions);
  const regularTxs = useSelector(sel.regularTransactions);
  const stakeTxs = useSelector(sel.stakeTransactions);
  const viewedTransaction = regularTxs[txHash]
    ? regularTxs[txHash]
    : stakeTxs[txHash];
  const [viewedDecodedTx, setViewedDecodedTx] = useState(
    decodedTransactions[txHash]
  );
  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!viewedTransaction) return send("REJECT");
        if (!viewedDecodedTx) return send("FETCH");
        send("RESOLVE");
      },
      load: async () => {
        if (!viewedDecodedTx) {
          const decodedTx = decodeRawTransactions(viewedTransaction.rawTx);
          let decodedTxWithInputs = decodedTx;
          if (!viewedTransaction.isStake) {
            decodedTxWithInputs = await getAmountFromTxInputs(decodedTx);
          }
          setViewedDecodedTx(decodedTxWithInputs);
          return send({ type: "RESOLVE" });
        }
      }
    }
  });

  switch (state.value) {
    case "idle":
      return <></>;
    case "loading":
      return (
        <StandalonePage
          header={Header({ ...viewedTransaction })}
          className="txdetails-standalone-page">
          <DecredLoading center />
        </StandalonePage>
      );
    case "success":
      return (
        <StandalonePage
          header={Header({ ...viewedTransaction })}
          className="txdetails-standalone-page">
          <TransactionPage
            {...{
              transactionDetails: viewedTransaction,
              decodedTransaction: viewedDecodedTx,
              abandonTransaction
            }}
          />
        </StandalonePage>
      );
    case "failure":
      return (
        <StandalonePage
          header={Header({ ...viewedTransaction })}
          className="txdetails-standalone-page">
          <p>Transaction not found</p>
        </StandalonePage>
      );
    default:
      return null;
  }
}

export default Transaction;
