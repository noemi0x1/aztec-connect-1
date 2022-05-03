import { useState } from 'react';
import { BorderBox, Button } from 'components';
import { ShieldComposerPhase, ShieldComposerState, ShieldFormValidationResult } from 'alt-model/shield';
import { CostBreakdown } from '../../modal_molecules/cost_breakdown';
import { Disclaimer } from '../../modal_molecules/disclaimer';
import { TransactionComplete } from '../../modal_molecules/transaction_complete';
import { VerticalSplitSection } from '../../sections/vertical_split_section';
import { ShieldSubmissionSteps } from './shield_submission_steps';
import style from './shield_confirmation_page.module.scss';

interface ShieldConfirmationPageProps {
  composerState: ShieldComposerState;
  validationResult: ShieldFormValidationResult;
  onSubmit: () => void;
  onClose: () => void;
}

export function ShieldConfirmationPage({
  composerState,
  validationResult,
  onSubmit,
  onClose,
}: ShieldConfirmationPageProps) {
  const [riskChecked, setRiskChecked] = useState(false);
  const hasError = !!composerState?.error;
  const asset = validationResult.input.targetAsset;
  const isIdle = composerState.phase === ShieldComposerPhase.IDLE;
  const showingComplete = composerState.phase === ShieldComposerPhase.DONE;
  const showingDeclaration = isIdle && !hasError;
  const canSubmit = riskChecked && isIdle;

  return (
    <div className={style.page2Wrapper}>
      <VerticalSplitSection
        topPanel={
          <div className={style.topStats}>
            <div className={style.description}>{'Details about your shield transaction'}</div>
          </div>
        }
        bottomPanel={
          <CostBreakdown
            recipient={validationResult.input.fields.recipientAlias}
            amount={validationResult.targetL2OutputAmount}
            fee={validationResult.input.feeAmount}
          />
        }
      />
      <BorderBox>
        {showingDeclaration ? (
          <Disclaimer
            accepted={riskChecked}
            onChangeAccepted={setRiskChecked}
            asset={asset}
            transactionLimit={validationResult.input.transactionLimit ?? 0n}
          />
        ) : showingComplete ? (
          <TransactionComplete onClose={onClose} />
        ) : (
          <ShieldSubmissionSteps
            composerState={composerState}
            requiresSpendingKey={validationResult.requiresSpendingKey}
          />
        )}
      </BorderBox>
      {!showingComplete && (
        <div className={style.footer}>
          <Button
            text={hasError ? 'Retry' : 'Confirm Submit'}
            onClick={canSubmit ? onSubmit : undefined}
            disabled={!canSubmit}
          />
        </div>
      )}
    </div>
  );
}