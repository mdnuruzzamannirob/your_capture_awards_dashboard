import Title from '@/components/common/Title';
import ContestTable from '@/components/modules/content/ContestTable';
import { Button } from '@/components/ui/button';
import ReduxProvider from '@/providers/ReduxProviders';
import { contestApi } from '@/store/features/contest/contestApi';
import { makeStore } from '@/store/makeStore';

const ContestPage = async () => {
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getContests.initiate({}));
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <ReduxProvider preloadedState={preloadedState}>
      <section className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-5">
          <Title title="Contest" description="Manage all contest" />
          <Button className="text-foreground">Create Contest</Button>
        </div>

        <ContestTable />
      </section>
    </ReduxProvider>
  );
};

export default ContestPage;
