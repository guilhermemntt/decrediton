const electron = require("electron");
const dialog = electron.remote.dialog;
import fs from "fs";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import Page from "./Page";
import { useEffect, useState } from "react";
import { useLNPage } from "../hooks";

export const WalletTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.wallet"
        m="On-chain balance and actions of the LN Wallet"
      />
    }
  />
);

const WalletTab = () => {
  const {
    updateWalletBalances,
    fundWallet,
    withdrawWallet,
    exportBackup,
    verifyBackup,
    walletBalances,
    info,
    defaultAccount,
    scbPath,
    scbUpdatedTime,
    tsDate
  } = useLNPage();

  const [amount, setAmount] = useState(0);
  const [account, setAccount] = useState(defaultAccount);
  const [actionsEnabled, setActionsEnabled] = useState(false);
  const [confirmFileOverwrite, setConfirmFileOverwrite] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setTimeout(() => updateWalletBalances(), 1000);
  }, [updateWalletBalances]);

  const onChangeAmount = (amount) => {
    const actionsEnabled = amount > 0 && account;
    setAmount(amount);
    setActionsEnabled(actionsEnabled);
  };

  const onChangeAccount = (account) => {
    const actionsEnabled = amount > 0 && account;
    setAccount(account);
    setActionsEnabled(actionsEnabled);
  };

  const onFundWallet = (passphrase) => {
    setSending(true);
    fundWallet(amount, account.value, passphrase)
      .then(() => {
        setSending(false);
        setAmount(0);
        setActionsEnabled(false);
      })
      .catch(() => {
        setSending(false);
      });
  };

  const onWithdrawWallet = () => {
    setSending(true);
    withdrawWallet(amount, account.value)
      .then(() => {
        setSending(false);
        setAmount(0);
        setActionsEnabled(false);
      })
      .catch(() => {
        setSending(false);
      });
  };

  const onConfirmFileOverwrite = async () => {
    const filePath = confirmFileOverwrite;
    if (!filePath) {
      return;
    }
    setConfirmFileOverwrite(null);
    await exportBackup(filePath);
  };

  const onCancelFileOverwrite = () => {
    setConfirmFileOverwrite(null);
  };

  const onBackup = async () => {
    setConfirmFileOverwrite(null);

    const { filePath } = await dialog.showSaveDialog();
    if (!filePath) {
      return;
    }

    // If this file already exists, show the confirmation modal.
    if (fs.existsSync(filePath)) {
      setConfirmFileOverwrite(filePath);
      return;
    }

    await exportBackup(filePath);
  };

  const onVerifyBackup = async () => {
    const { filePaths } = await dialog.showOpenDialog();
    const filePath = filePaths[0];
    if (!filePath) {
      return;
    }

    await verifyBackup(filePath);
  };

  const {
    confirmedBalance,
    unconfirmedBalance,
    totalBalance
  } = walletBalances;

  const { alias, identityPubkey } = info;

  return (
    <Page
      alias={alias}
      identityPubkey={identityPubkey}
      confirmedBalance={confirmedBalance}
      unconfirmedBalance={unconfirmedBalance}
      account={account}
      amount={amount}
      totalBalance={totalBalance}
      actionsEnabled={actionsEnabled && !sending}
      tsDate={tsDate}
      scbPath={scbPath}
      scbUpdatedTime={scbUpdatedTime}
      confirmFileOverwrite={confirmFileOverwrite}
      onChangeAmount={onChangeAmount}
      onChangeAccount={onChangeAccount}
      onFundWallet={onFundWallet}
      onWithdrawWallet={onWithdrawWallet}
      onBackup={onBackup}
      onVerifyBackup={onVerifyBackup}
      onCancelFileOverwrite={onCancelFileOverwrite}
      onConfirmFileOverwrite={onConfirmFileOverwrite}
    />
  );
};

export default WalletTab;
