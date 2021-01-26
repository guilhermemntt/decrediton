import { useCallback, useEffect } from "react";
import AccountsSelect from "./AccountsSelect";
import { useSelector, useDispatch } from "react-redux";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

function ReceiveAccountsSelect({
  onChange,
  className,
  showAccountsButton,
  disabled,
  account
}) {
  const dispatch = useDispatch();
  const mixedAccount = useSelector(sel.getMixedAccount);
  const nextAddressAccount = useSelector(sel.nextAddressAccount);

  const getNextAddressAttempt = useCallback(
    (value) => dispatch(ca.getNextAddressAttempt(value)),
    [dispatch]
  );
  const onChangeAccount = useCallback(
    (account) => {
      onChange && onChange(account);
      getNextAddressAttempt(account.value);
    },
    [getNextAddressAttempt, onChange]
  );

  useEffect(() => {
    if(!nextAddressAccount) return;
    if (account && account != nextAddressAccount.value) {
      getNextAddressAttempt(account);
    }
  }, [account, getNextAddressAttempt, nextAddressAccount]);

  const accountA = (!nextAddressAccount || account && account != nextAddressAccount.value)
  ? null
  : nextAddressAccount;

  return (
    <AccountsSelect
      {...{
        showAccountsButton,
        className,
        onChange: onChangeAccount,
        accountsType: "visible",
        filterAccounts: [mixedAccount],
        // If account property is defined, the getNextAddressAttampt action
        // needs to be called with it, which updates nextAddressAccount
        // eventually. Until it happens, it's better to show no account
        // than a previously chosen one.
        account: accountA,
        disabled
      }}
    />
  );
}

export default ReceiveAccountsSelect;
