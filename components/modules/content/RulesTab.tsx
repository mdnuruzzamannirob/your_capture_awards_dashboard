'use client';

import DynamicIcon from '@/components/common/DynamicIcon';
import { contestRuleDefinitions } from '@/lib/constants';
import type { Contest, ContestRule, LevelRequirement, SubmissionFormatValue, SubmissionRulesValue } from '@/store/features/contest/types';

type TextRuleValue = { text?: string };

function renderRuleValue(rule: ContestRule) {
  switch (rule.key) {
    case 'SUBMISSION_LIMIT': return <p className="text-2xl font-semibold">{Number(rule.value)} submissions</p>;
    case 'SUBMISSION_RULES': {
      const value = rule.value as SubmissionRulesValue;
      return <div className="space-y-3 text-sm"><p className="font-medium">{value.intro}</p><ul className="text-muted-foreground list-disc space-y-1 pl-5">{value.disallowed?.map((item) => <li key={item}>{item}</li>)}</ul><p className="text-muted-foreground">{value.removalNotice}</p></div>;
    }
    case 'LEVEL_REQUIREMENTS': return <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{(rule.value as LevelRequirement[]).map((item) => <div key={item.level} className="bg-surface-tertiary rounded-lg p-3"><p className="text-muted-foreground text-xs capitalize">{item.level.toLowerCase().replace('_', ' ')}</p><p className="mt-1 font-semibold">{item.votes.toLocaleString()} votes</p></div>)}</div>;
    case 'SUBMISSION_FORMAT': { const value = rule.value as SubmissionFormatValue; return <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-muted-foreground">Formats</p><p className="font-medium">{value.mimeTypes?.map((type) => type.split('/')[1]?.toUpperCase()).join(', ')}</p></div><div><p className="text-muted-foreground">Min width</p><p className="font-medium">{value.minWidth}px</p></div><div><p className="text-muted-foreground">Min height</p><p className="font-medium">{value.minHeight}px</p></div><div><p className="text-muted-foreground">Max size</p><p className="font-medium">{value.maxSizeMB}MB</p></div></div>; }
    case 'ELIGIBILITY': return <p className="text-sm font-medium">Minimum age: {(rule.value as { minAge?: number }).minAge}</p>;
    case 'COPYRIGHT': case 'VOTING': case 'PARTICIPATION': return <p className="text-muted-foreground text-sm">{(rule.value as TextRuleValue).text}</p>;
    default: return null;
  }
}

const RulesTab = ({ contest }: { contest: Contest }) => {
  const rules = [...(contest.rules ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return <div className="grid gap-4">{rules.length ? rules.map((rule) => { const definition = contestRuleDefinitions[rule.key]; return <article key={rule.key} className="border-border-subtle bg-surface-secondary rounded-lg border p-5"><div className="mb-4 flex items-center gap-2"><DynamicIcon name={rule.icon ?? definition?.icon ?? 'SlidersHorizontal'} className="text-primary size-5" /><h3 className="font-semibold">{rule.label ?? rule.name ?? definition?.label ?? rule.key}</h3></div>{renderRuleValue(rule)}</article>; }) : <p className="border-border-subtle text-muted-foreground rounded-lg border p-5 text-sm">No rules available for this contest.</p>}</div>;
};

export default RulesTab;
