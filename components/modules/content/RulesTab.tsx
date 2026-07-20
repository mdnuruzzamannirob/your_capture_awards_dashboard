'use client';

import DynamicIcon from '@/components/common/DynamicIcon';
import { Badge } from '@/components/ui/badge';
import { contestRuleDefinitions } from '@/lib/constants';
import type {
  Contest,
  ContestRule,
  CopyrightValue,
  EligibilityValue,
  LevelRequirement,
  ParticipationValue,
  SubmissionFormatValue,
  SubmissionRulesValue,
  VotingValue,
} from '@/store/features/contest/types';
import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';

function BooleanValue({ value, children }: { value: boolean; children: ReactNode }) {
  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
      {value ? (
        <Check className="text-success size-4" />
      ) : (
        <X className="text-destructive size-4" />
      )}
      {children}
    </span>
  );
}

function renderRuleValue(rule: ContestRule) {
  switch (rule.key) {
    case 'SUBMISSION_LIMIT':
      return <p className="text-2xl font-semibold">{Number(rule.value)} submissions</p>;
    case 'SUBMISSION_RULES': {
      const value = rule.value as SubmissionRulesValue;
      return (
        <div className="space-y-3 text-sm">
          <p className="font-medium">{value.intro}</p>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5">
            {value.disallowed?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-muted-foreground">{value.removalNotice}</p>
          <div className="flex flex-wrap gap-5">
            <BooleanValue value={Boolean(value.allowAiImages)}>AI images allowed</BooleanValue>
            <span className="text-muted-foreground text-sm">
              Duplicate policy: {value.duplicatePolicy?.toLowerCase().replaceAll('_', ' ')}
            </span>
          </div>
        </div>
      );
    }
    case 'LEVEL_REQUIREMENTS':
      return (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {(rule.value as LevelRequirement[]).map((item) => (
            <div key={item.level} className="bg-surface-tertiary rounded-lg p-3">
              <p className="text-muted-foreground text-xs capitalize">
                {item.level.toLowerCase().replace('_', ' ')}
              </p>
              <p className="mt-1 font-semibold">{item.votes.toLocaleString()} votes</p>
            </div>
          ))}
        </div>
      );
    case 'SUBMISSION_FORMAT': {
      const value = rule.value as SubmissionFormatValue;
      return (
        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Formats</p>
            <p className="font-medium">
              {value.mimeTypes?.map((type) => type.split('/')[1]?.toUpperCase()).join(', ')}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Min width</p>
            <p className="font-medium">{value.minWidth}px</p>
          </div>
          <div>
            <p className="text-muted-foreground">Min height</p>
            <p className="font-medium">{value.minHeight}px</p>
          </div>
          <div>
            <p className="text-muted-foreground">Max size</p>
            <p className="font-medium">{value.maxSizeMB}MB</p>
          </div>
        </div>
      );
    }
    case 'ELIGIBILITY': {
      const value = rule.value as EligibilityValue;
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{value.text}</p>
          <div className="flex flex-wrap gap-5">
            <span className="text-sm font-medium">Minimum age: {value.minAge}</span>
            <BooleanValue value={Boolean(value.requiresAcceptance)}>
              Acceptance required
            </BooleanValue>
          </div>
        </div>
      );
    }
    case 'COPYRIGHT': {
      const value = rule.value as CopyrightValue;
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{value.text}</p>
          <div className="flex flex-wrap gap-5">
            <BooleanValue value={Boolean(value.requiresOwnership)}>Ownership required</BooleanValue>
            <BooleanValue value={Boolean(value.requiresAcceptance)}>
              Acceptance required
            </BooleanValue>
          </div>
        </div>
      );
    }
    case 'VOTING': {
      const value = rule.value as VotingValue;
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{value.text}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanValue value={Boolean(value.membersOnly)}>Members only</BooleanValue>
            <BooleanValue value={Boolean(value.requireContestParticipant)}>
              Contest participants only
            </BooleanValue>
            <BooleanValue value={Boolean(value.disallowSelfVote)}>
              Self vote disallowed
            </BooleanValue>
            <BooleanValue value={Boolean(value.blindVoting)}>Blind voting</BooleanValue>
          </div>
        </div>
      );
    }
    case 'PARTICIPATION': {
      const value = rule.value as ParticipationValue;
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{value.text}</p>
          <div className="flex flex-wrap gap-5">
            <BooleanValue value={Boolean(value.requiresTermsAcceptance)}>
              Terms acceptance required
            </BooleanValue>
            {value.termsUrl && (
              <span className="text-muted-foreground text-sm">Terms: {value.termsUrl}</span>
            )}
          </div>
        </div>
      );
    }
    default:
      return (
        <p className="text-muted-foreground text-sm">{rule.description ?? 'No rule details.'}</p>
      );
  }
}

const RulesTab = ({ contest }: { contest: Contest }) => {
  const rules = [...(contest.rules ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="grid gap-4">
      {rules.length ? (
        rules.map((rule) => {
          const definition = contestRuleDefinitions[rule.key];
          return (
            <article key={rule.key} className="border-border bg-surface rounded-xl border p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <DynamicIcon
                    name={rule.icon ?? definition?.icon ?? 'SlidersHorizontal'}
                    className="text-primary size-5"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {rule.label ?? rule.name ?? definition?.label ?? rule.key}
                    </h3>
                    {rule.description && (
                      <p className="text-muted-foreground text-xs">{rule.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(rule.appliesTo ?? definition?.appliesTo ?? []).map((item) => (
                    <Badge key={item} variant="outline" className="capitalize">
                      {item.toLowerCase().replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              {renderRuleValue(rule)}
            </article>
          );
        })
      ) : (
        <p className="text-muted-foreground rounded-xl border p-5 text-sm">
          No rules available for this contest.
        </p>
      )}
    </div>
  );
};

export default RulesTab;
