import { useState } from "react";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import * as sel from "selectors";
import { useSelector } from "react-redux";
import Page from "./Page";
import { useLNPage } from "../hooks";

export const useChannelBalances = () => ({
  channelBalances: useSelector(sel.lnChannelBalances)
});

export const InvoicesTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.invoices"
        m="Invoices (payment requests) created by this LN wallet."
      />
    }
  />
);

const InvoicesTab = () => {
  const [atomValue, setAtomValue] = useState(0);
  const [memo, setMemo] = useState("");
  const [lastPayRequest, setLastPayRequest] = useState("");
  const [, setValue] = useState();
  const [lastError, setLastError] = useState("");

  const { invoices, tsDate, addInvoiceAttempt, addInvoice } = useLNPage();

  const onValueChanged = ({ atomValue }) => {
    setAtomValue(atomValue);
  };

  const onMemoChanged = (e) => {
    if (e.target.value.length > 639) {
      // This is the length limit for the memo field in a payment request.
      return;
    }

    setMemo(e.target.value);
  };

  const onAddInvoice = () => {
    setLastPayRequest("");
    setLastError(null);
    addInvoice(memo, atomValue)
      .then((payReq) => {
        setMemo("");
        setValue(0);
        setLastPayRequest(payReq.paymentRequest);
      })
      .catch((error) => {
        setLastError(error);
      });
  };

  return (
    <Page
      invoices={invoices}
      tsDate={tsDate}
      value={atomValue}
      memo={memo}
      addInvoiceAttempt={addInvoiceAttempt}
      lastPayRequest={lastPayRequest}
      lastError={lastError}
      onValueChanged={onValueChanged}
      onMemoChanged={onMemoChanged}
      onAddInvoice={onAddInvoice}
    />
  );
};

export default InvoicesTab;
