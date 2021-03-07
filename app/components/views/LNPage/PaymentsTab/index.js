import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import Page from "./Page";
import ReactTimeout from "react-timeout";
import { useLNPage } from "../hooks";

export const PaymentsTabHeader = () => (
  <DescriptionHeader
    description={
      <T id="ln.description.payments" m="Payments sent from this LN wallet." />
    }
  />
);

const PaymentsTab = ({ setTimeout, clearTimeout }) => {
  const [sendValueAtom, setSendValueAtom] = useState(0);
  const [payRequest, setPayRequest] = useState("");
  const [decodedPayRequest, setDecodedPayRequest] = useState(null);
  const [decodingError, setDecodingError] = useState(null);
  const [expired, setExpired] = useState(false);

  const lastDecodeTimer = useRef(null);

  const {
    payments,
    outstandingPayments,
    failedPayments,
    tsDate,
    decodePayRequest,
    sendPayment
  } = useLNPage();

  const checkExpired = () => {
    if (!decodedPayRequest) return;
    const timeToExpire =
      (decodedPayRequest.timestamp + decodedPayRequest.expiry) * 1000 -
      Date.now();
    if (timeToExpire < 0) {
      setState({ expired: true });
    }
  }

  const decodePayRequestCallback = () => {
    lastDecodeTimer.current = null;
    if (!payRequest) {
      setDecodingError(null);
      setDecodedPayRequest(null);
      return;
    }
    decodePayRequest(payRequest)
      .then((resp) => {
        const timeToExpire = (resp.timestamp + resp.expiry) * 1000 - Date.now();
        const expired = timeToExpire < 0;
        if (!expired) {
          setTimeout(checkExpired, timeToExpire + 1000);
        }
        setDecodedPayRequest(resp);
        setDecodingError(null);
        setExpired(expired);
      })
      .catch((error) => {
        setState({ decodedPayRequest: null, decodingError: error });
      });
  }

  const onPayRequestChanged = (e) => {
    setPayRequest(("" + e.target.value).trim());
    setDecodedPayRequest(null);
    setExpired(false);
    if (lastDecodeTimer.current) {
      clearTimeout(lastDecodeTimer.current);
    }
    lastDecodeTimer.current = setTimeout(decodePayRequestCallback, 1000);
  }

  const onSendValueChanged = ({ atomValue }) => {
    setSendValueAtom(atomValue);
  }

  const onSendPayment = () => {
    if (!payRequest || !decodedPayRequest) {
      return;
    }
    setPayRequest("");
    setDecodedPayRequest(null);
    setSendValue(0);
    sendPayment(payRequest, sendValueAtom);
  }

  return (
    <Page
      payments={payments}
      outstandingPayments={outstandingPayments}
      failedPayments={failedPayments}
      tsDate={tsDate}
      payRequest={payRequest}
      decodedPayRequest={decodedPayRequest}
      decodingError={decodingError}
      expired={expired}
      sending={sending}
      sendValue={sendValueAtom}
      onPayRequestChanged={onPayRequestChanged}
      onSendPayment={onSendPayment}
      onSendValueChanged={onSendValueChanged}
    />
  );
};

export default ReactTimeout(PaymentsTab);
