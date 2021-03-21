import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import styles from "./OutstandingPayment.module.css";

const Payment = ({ payment, tsDate }) => (
  <div className={styles.lnPayment}>
    <div>
      <div className={styles.value}>
        <Balance amount={payment.valueAtoms} />
      </div>
      <div className="fee">
        <Balance amount={payment.fee} />
      </div>
    </div>
    <div>
      <div>
        <T
          id="ln.paymentsTab.payment.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(payment.creationDate) }}
        />
      </div>
      <div className={styles.rhash}>{payment.paymentHash}</div>
    </div>
  </div>
);

export default Payment;
