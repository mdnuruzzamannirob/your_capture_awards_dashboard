import ContestTable from '@/components/modules/content/ContestTable';
import { Button } from '@/components/ui/button';

const ContestPage = () => {
  return (
    <section className="space-y-5 p-5">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h3 className="flex-1 text-xl font-semibold">Contest List</h3>
          <p className="text-sm">Manage contest list</p>
        </div>
        <Button className="text-foreground">Create Contest</Button>
      </div>
      <ContestTable />
    </section>
  );
};

export default ContestPage;
