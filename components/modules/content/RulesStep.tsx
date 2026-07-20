'use client';

import DynamicIcon from '@/components/common/DynamicIcon';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { contestRuleDefinitions } from '@/lib/constants';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { useFormContext, type FieldPath } from 'react-hook-form';

function RuleSection({
  ruleKey,
  children,
}: {
  ruleKey: keyof typeof contestRuleDefinitions;
  children: ReactNode;
}) {
  const definition = contestRuleDefinitions[ruleKey];

  return (
    <section className="border-border space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <DynamicIcon name={definition.icon} className="text-muted-foreground size-4" />
          {definition.label}
        </h3>
        <span className="text-caption-foreground text-xs capitalize">
          {definition.appliesTo.map((item) => item.toLowerCase().replace('_', ' ')).join(', ')}
        </span>
      </div>
      {children}
    </section>
  );
}

function RuleCheckbox({ name, label }: { name: FieldPath<ContestFinalValues>; label: string }) {
  const form = useFormContext<ContestFinalValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-2 space-y-0">
          <FormControl>
            <Checkbox checked={Boolean(field.value)} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="mt-0! text-sm">{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const RulesStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const levels = form.watch('rules.levelRequirements');

  return (
    <div className="border-border bg-surface space-y-5 rounded-xl border p-5">
      <h2 className="border-border flex items-center gap-2 border-b pb-4 text-lg font-semibold">
        <SlidersHorizontal className="text-primary size-5" /> Rules
      </h2>

      <div className="space-y-4">
        <RuleSection ruleKey="SUBMISSION_RULES">
          <FormField
            control={form.control}
            name="rules.submissionRules.intro"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input aria-label="Submission rules introduction" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rules.submissionRules.disallowed"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    aria-label="Disallowed submissions"
                    className="scrollbar-thin min-h-28"
                    value={field.value.join('\n')}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split('\n')
                          .map((item) => item.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </FormControl>
                <p className="text-caption-foreground text-xs">Enter one item per line.</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rules.submissionRules.removalNotice"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input aria-label="Submission removal notice" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid items-start gap-4 md:grid-cols-2">
            <RuleCheckbox name="rules.submissionRules.allowAiImages" label="Allow AI images" />
            <FormField
              control={form.control}
              name="rules.submissionRules.duplicatePolicy"
              render={({ field }) => (
                <FormItem>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10! w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DISALLOW_SAME_PHOTO">Disallow same photo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </RuleSection>

        <RuleSection ruleKey="LEVEL_REQUIREMENTS">
          <div className="space-y-2">
            {levels.map((item, index) => (
              <div key={item.level} className="grid items-center gap-3 sm:grid-cols-[90px_1fr]">
                <span className="bg-primary-soft text-primary-soft-foreground rounded-full px-3 py-1 text-center text-xs font-medium capitalize">
                  {item.level.toLowerCase().replace('_', ' ')}
                </span>
                <FormField
                  control={form.control}
                  name={`rules.levelRequirements.${index}.votes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          aria-label={`${item.level} required votes`}
                          {...field}
                          onChange={(event) => field.onChange(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </RuleSection>

        <RuleSection ruleKey="SUBMISSION_FORMAT">
          <FormField
            control={form.control}
            name="rules.submissionFormat.mimeTypes"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-wrap gap-5">
                  {[
                    ['image/jpeg', 'JPEG'],
                    ['image/png', 'PNG'],
                  ].map(([mimeType, label]) => (
                    <label key={mimeType} className="flex items-center gap-2 text-sm font-medium">
                      <Checkbox
                        checked={field.value.includes(mimeType as 'image/jpeg' | 'image/png')}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...field.value, mimeType]
                            : field.value.filter((item) => item !== mimeType);
                          field.onChange(next);
                        }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {(
              [
                ['minWidth', 'Min width (px)'],
                ['minHeight', 'Min height (px)'],
                ['maxSizeMB', 'Max size (MB)'],
              ] as const
            ).map(([key, label]) => (
              <FormField
                key={key}
                control={form.control}
                name={`rules.submissionFormat.${key}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </RuleSection>

        <RuleSection ruleKey="ELIGIBILITY">
          <div className="grid items-start gap-4 md:grid-cols-[100px_1fr]">
            <FormField
              control={form.control}
              name="rules.eligibility.minAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={120}
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rules.eligibility.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <RuleCheckbox name="rules.eligibility.requiresAcceptance" label="Requires acceptance" />
        </RuleSection>

        <RuleSection ruleKey="COPYRIGHT">
          <FormField
            control={form.control}
            name="rules.copyright.text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input aria-label="Copyright text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-6">
            <RuleCheckbox name="rules.copyright.requiresOwnership" label="Requires ownership" />
            <RuleCheckbox name="rules.copyright.requiresAcceptance" label="Requires acceptance" />
          </div>
        </RuleSection>

        <RuleSection ruleKey="VOTING">
          <FormField
            control={form.control}
            name="rules.voting.text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input aria-label="Voting text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <RuleCheckbox name="rules.voting.membersOnly" label="Members only" />
            <RuleCheckbox name="rules.voting.blindVoting" label="Blind voting" />
            <RuleCheckbox
              name="rules.voting.requireContestParticipant"
              label="Must be a participant"
            />
            <RuleCheckbox name="rules.voting.disallowSelfVote" label="Disallow self vote" />
          </div>
        </RuleSection>

        <RuleSection ruleKey="PARTICIPATION">
          <FormField
            control={form.control}
            name="rules.participation.text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input aria-label="Participation text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid items-start gap-4 md:grid-cols-2">
            <RuleCheckbox
              name="rules.participation.requiresTermsAcceptance"
              label="Requires terms acceptance"
            />
            <FormField
              control={form.control}
              name="rules.participation.termsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      aria-label="Terms URL"
                      placeholder="/terms"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </RuleSection>
      </div>
    </div>
  );
};

export default RulesStep;
