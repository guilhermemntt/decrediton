import { useState } from "react";
import { spring } from "react-motion";
import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { ReceiveAccountsSelect, PathBrowseInput } from "inputs";
import {
  PassphraseModalButton,
  TextToggle,
  InfoDocModalButton,
  KeyBlueButton
} from "buttons";
import { TransitionMotionWrapper, Documentation } from "shared";
import { Checkbox, classNames } from "pi-ui";
import {
  CREATE_LN_ACCOUNT,
  LNWALLET_STARTUPSTAGE_STARTDCRLND,
  LNWALLET_STARTUPSTAGE_CONNECT,
  LNWALLET_STARTUPSTAGE_UNLOCK,
  LNWALLET_STARTUPSTAGE_STARTUPSYNC,
  LNWALLET_STARTUPSTAGE_SCBRESTORE
} from "actions/LNActions";
import styles from "./ConnectPage.module.css";
import { LN_ICON } from "constants";
import { useLNPage } from "../hooks";

const ConnectPageHeader = () => (
  <StandaloneHeader
    title={<T id="ln.connectPage.title" m="Start Lightning Wallet" />}
    description={
      <T
        id="ln.connectPage.description"
        m={"Start, unlock and connect to the dcrlnd wallet."}
      />
    }
    iconType={LN_ICON}
  />
);

const CreateLNWalletPageHeader = () => (
  <StandaloneHeader
    title={<T id="ln.createLNWalletPage.title" m="Create Lightning Wallet" />}
    description={
      <T
        id="ln.createLNWalletPage.description"
        m={
          "Create a new Lightning Network wallet backed by the Decrediton wallet."
        }
      />
    }
    iconType={LN_ICON}
  />
);

const stageMsgs = {
  [LNWALLET_STARTUPSTAGE_STARTDCRLND]: (
    <T id="ln.startupStage.startDcrlnd" m="Starting dcrlnd" />
  ),
  [LNWALLET_STARTUPSTAGE_CONNECT]: (
    <T id="ln.startupStage.connect" m="Connecting to dcrlnd" />
  ),
  [LNWALLET_STARTUPSTAGE_UNLOCK]: (
    <T id="ln.startupStage.unlock" m="Unlocking LN wallet" />
  ),
  [LNWALLET_STARTUPSTAGE_STARTUPSYNC]: (
    <T id="ln.startupStage.startupSync" m="Syncing LN wallet to network" />
  ),
  [LNWALLET_STARTUPSTAGE_SCBRESTORE]: (
    <T id="ln.startupStage.scbRestore" m="Restoring backup" />
  )
};

const LNStartupStage = ({ stage }) => (
  <div>
    {stageMsgs[stage] ? stageMsgs[stage] : null}
  </div>
);

const LNCreationWarning = ({ onAcceptCreationWarning }) => (
  <>
    <Documentation name="LNWalletCreationWarning" />
    <KeyBlueButton onClick={onAcceptCreationWarning}>
      <T
        id="ln.createWalletWarning.okBtn"
        m="I understand and accept the risks"
      />
    </KeyBlueButton>
  </>
);

const wrapperComponent = (props) => <div className={styles.accountList} {...props} />;

// The below constant MUST match what TextToggle expects/uses.
const NEW_ACCOUNT = "left";

const ConnectPage = () => {
  const {
    defaultAccount,
    lightningWalletExists,
    startDcrlnd,
    startAttempt,
    startupStage
  } = useLNPage();

  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [account, setAccount] = useState(defaultAccount);
  const [accountOption, setAccountOption] = useState(NEW_ACCOUNT);
  const [scbFile, setScbFile] = useState("");
  const [displayCreationWarning, setDisplayCreationWarning] = useState(!lightningWalletExists);

  const onChangeAccount = (account) => {
    setAccount(account);
  };

  const onLaunch = (passphrase) => {
    let accountAux = null;
    if (!lightningWalletExists) {
      if (accountOption === NEW_ACCOUNT) {
        accountAux = CREATE_LN_ACCOUNT;
      } else {
        accountAux = account.value;
      }
    }

    startDcrlnd(
      passphrase,
      autopilotEnabled,
      accountAux,
      scbFile
    );
  };

  const onChangeEnableAutopilot = () => {
    setAutopilotEnabled(autopilotEnabled);
  };

  const onAccountOptionClick = (value) => {
    setAccountOption(value);
  };

  const onAcceptCreationWarning = () => {
    setDisplayCreationWarning(false);
  };

  const getAccountsListComponent = () => {
    return [
      {
        data: (
          <>
            <ReceiveAccountsSelect
              account={account}
              onChange={onChangeAccount}
              showAccountsButton={false}
              hideSpendable={false}
            />
            <div className={styles.existingAccountWarning}>
              <T
                id="ln.connectPage.useExistingAccountWarning"
                m={`Attention: note that a running LN wallet maintains unencrypted keys
          in memory while it's running and also takes control of all funds of the
          given account. It's recommended to have an account dedicated to LN
          operations and only transfer the funds you intend to use in LN to it.`}
              />
            </div>
          </>
        ),
        key: "output_0",
        style: {
          height: spring(140, { stiffness: 100, damping: 14 }),
          opacity: spring(1, { stiffness: 100, damping: 20 })
        }
      }
    ];
  };

  const getNullStyles = () => [
    {
      data: null,
      key: "output_0",
      style: {
        height: spring(0, { stiffness: 100, damping: 14 }),
        opacity: spring(0, { stiffness: 100, damping: 20 })
      }
    }
  ];

  const renderSelectLNAccount = () => (
    <div className={styles.connectOpt}>
      <div className={styles.label}>
        <T id="ln.connectPage.account" m="Wallet account to use" />
      </div>
      <div className={styles.accountSelection}>
        <div>
          {/* XXX: Can we use here pi-iu's toggle? */}
          <TextToggle
            leftText={<T id="ln.connectPage.createAccount" m="Create new" />}
            rightText={<T id="ln.connectPage.useAccount" m="Use existing" />}
            activeButton={accountOption}
            toggleAction={onAccountOptionClick}
          />
        </div>
        <TransitionMotionWrapper
          {...{
            styles:
              accountOption === NEW_ACCOUNT
                ? getNullStyles()
                : getAccountsListComponent(),
            wrapperComponent
          }}
        />
      </div>
    </div>
  );

  const renderCreateLNWallet = () => (
    <>
      {renderSelectLNAccount()}
      <div className={styles.connectOpt}>
        <div className={styles.label}>
          <T id="ln.connectPage.backupFile" m="Restore SCB backup" />
        </div>
        <div className={styles.fileInput}>
          <PathBrowseInput
            open
            type="file"
            value={scbFile}
            onChange={(value) => setScbFile(value)}
          />
        </div>

        <InfoDocModalButton
          document="LNBackupInfo"
          double
          draggable
        />
      </div>
    </>
  );

  if (displayCreationWarning) {
    return (
      <StandalonePage header={<CreateLNWalletPageHeader />}>
        <LNCreationWarning
          onAcceptCreationWarning={onAcceptCreationWarning}
        />
      </StandalonePage>
    );
  }

  const header = lightningWalletExists ? (
    <ConnectPageHeader />
  ) : (
    <CreateLNWalletPageHeader />
  );

  return (
    <StandalonePage header={header}>
      <div>
        <div className={styles.connectOpts}>
          {!lightningWalletExists ? renderCreateLNWallet() : null}
          <div className={classNames(styles.connectOpt, styles.checkbox)}>
            <Checkbox
              label={
                <T
                  id="ln.connectPage.enableAutopilot"
                  m="Enable Automatic Channel Creation"
                />
              }
              description={
                <T
                  id="ln.connectPage.enableAutopilotDescr"
                  m="This enables the 'autopilot' feature, which tries to automatically open channels using up to 60% of the account's spendable funds."
                />
              }
              checked={autopilotEnabled}
              onChange={onChangeEnableAutopilot}
            />
          </div>
        </div>

        <PassphraseModalButton
          modalTitle={
            <T id="ln.connectPage.unlockWalletModal" m="Unlock LN Wallet" />
          }
          disabled={startAttempt}
          onSubmit={onLaunch}
          loading={startAttempt}
          buttonLabel={
            <T id="ln.connectPage.launchBtn" m="Start and Unlock LN Wallet" />
          }
        />
        <LNStartupStage stage={startupStage} />
      </div>
    </StandalonePage>
  );
};

export default ConnectPage;
