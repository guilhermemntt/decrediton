import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import * as lna from "actions/LNActions";
import * as sel from "selectors";

export function useLNPage() {
  const lnActive = useSelector(sel.lnActive);
  const startupStage = useSelector(sel.lnStartupStage);
  const startAttempt = useSelector(sel.lnStartAttempt);
  const walletBalances = useSelector(sel.lnWalletBalances);
  const channelBalances = useSelector(sel.lnChannelBalances);
  const channels = useSelector(sel.lnChannels);
  const pendingChannels = useSelector(sel.lnPendingChannels);
  const closedChannels = useSelector(sel.lnClosedChannels);
  const invoices = useSelector(sel.lnInvoices);
  const payments = useSelector(sel.lnPayments);
  const outstandingPayments = useSelector(sel.lnOutstandingPayments);
  const failedPayments = useSelector(sel.lnFailedPayments);
  const tsDate = useSelector(sel.tsDate);
  const addInvoiceAttempt = useSelector(sel.lnAddInvoiceAttempt);
  const info = useSelector(sel.lnInfo);
  const defaultAccount = useSelector(sel.defaultSpendingAccount);
  const lightningWalletExists = useSelector(sel.lnWalletExists);
  const isMainNet = useSelector(sel.isMainNet);
  const scbPath = useSelector(sel.lnSCBPath);
  const scbUpdatedTime = useSelector(sel.lnSCBUpdatedTime);

  const dispatch = useDispatch();

  const updateWalletBalances = useCallback(() => dispatch(lna.updateLNWalletBalances()), [dispatch]);
  const addInvoice = useCallback(() => dispatch(lna.addInvoice()), [dispatch]);
  const decodePayRequest = useCallback(() => dispatch(lna.decodePayRequest()), [dispatch]);
  const sendPayment = useCallback(() => dispatch(lna.sendPayment()), [dispatch]);
  const openChannel = useCallback(() => dispatch(lna.openChannel()), [dispatch]);
  const closeChannel = useCallback(() => dispatch(lna.closeChannel()), [dispatch]);
  const fundWallet = useCallback(() => dispatch(lna.fundWallet()), [dispatch]);
  const withdrawWallet = useCallback(() => dispatch(lna.withdrawWallet()), [dispatch]);
  const startDcrlnd = useCallback(() => dispatch(lna.startDcrlnd()), [dispatch]);
  const exportBackup = useCallback(() => dispatch(lna.exportBackup()), [dispatch]);
  const verifyBackup = useCallback(() => dispatch(lna.verifyBacku()), [dispatch]);

  return {
    lnActive,
    startupStage,
    startAttempt,
    walletBalances,
    channelBalances,
    channels,
    pendingChannels,
    closedChannels,
    invoices,
    payments,
    outstandingPayments,
    failedPayments,
    tsDate,
    addInvoiceAttempt,
    info,
    defaultAccount,
    lightningWalletExists,
    isMainNet,
    scbPath,
    scbUpdatedTime,
    updateWalletBalances,
    addInvoice,
    decodePayRequest,
    sendPayment,
    openChannel,
    closeChannel,
    fundWallet,
    withdrawWallet,
    startDcrlnd,
    exportBackup,
    verifyBackup,
  };
};
