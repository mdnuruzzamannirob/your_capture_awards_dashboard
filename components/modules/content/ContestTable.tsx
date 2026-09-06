'use client';

import { DataTable } from '@/components/common/DataTable';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetContestsQuery, useLazyGetContestQuery } from '@/store/features/contest/contestApi';
import type { Contest } from '@/store/features/contest/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { columns } from './contest-columns';

function isContestConfigurationMissing(contest: Contest) {
  return (
    !Array.isArray(contest.rules) ||
    (!Array.isArray(contest.prizes) && !Array.isArray(contest.awards))
  );
}

const ContestTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'active' | 'ended'>('all');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [contestDetailsById, setContestDetailsById] = useState<Record<string, Contest>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetContestsQuery({
    page,
    limit,
    search,
    tab: tab === 'all' ? undefined : tab,
    includeArchived,
  });
  const [getContest, { isFetching: isFetchingDetails }] = useLazyGetContestQuery();
  const contests = useMemo(() => data?.data?.contests ?? [], [data?.data?.contests]);
  const hydratedContests = useMemo(
    () =>
      contests.map((contest) => ({
        ...contest,
        ...contestDetailsById[contest.id],
      })),
    [contestDetailsById, contests],
  );

  useEffect(() => {
    let isActive = true;
    const missingContests = contests.filter(
      (contest) => isContestConfigurationMissing(contest) && !contestDetailsById[contest.id],
    );

    if (!missingContests.length) return;

    Promise.all(
      missingContests.map((contest) =>
        getContest({ id: contest.id }, true)
          .unwrap()
          .then((response) => response.data)
          .catch(() => null),
      ),
    ).then((results) => {
      if (!isActive) return;

      const nextDetails = results.reduce<Record<string, Contest>>((acc, contest) => {
        if (contest?.id) acc[contest.id] = contest;
        return acc;
      }, {});

      if (Object.keys(nextDetails).length) {
        setContestDetailsById((current) => ({ ...current, ...nextDetails }));
      }
    });

    return () => {
      isActive = false;
    };
  }, [contestDetailsById, contests, getContest]);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="contest-search" className="sr-only">
            Search contests
          </label>
          <Input
            id="contest-search"
            type="text"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setPage(1);
            }}
            placeholder="Search contests..."
            className="max-w-md"
          />

          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as 'all' | 'active' | 'ended');
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="include-archived"
            checked={includeArchived}
            onCheckedChange={(checked) => {
              setIncludeArchived(checked);
              setPage(1);
            }}
          />
          <Label htmlFor="include-archived" className="text-xs">
            Include archived (deleted)
          </Label>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={hydratedContests}
        page={page}
        pageSize={limit}
        total={data?.data?.total ?? data?.data?.count ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onRowClick={(value) => {
          router.push(`/contest/${value.id}`);
        }}
        isLoading={isLoading || isFetching || isFetchingDetails}
        hideViewOptions
        hideSearch
      />
    </div>
  );
};

export default ContestTable;
