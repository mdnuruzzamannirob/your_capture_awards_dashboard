import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Title from '@/components/common/Title';
import CreateContest from '@/components/modules/content/CreateContest';

const CreateContestPage = () => {
  return (
    <section className="space-y-5 p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link href="/contest">Contest</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Contest</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Title
        title="Create New Contest"
        description="Setup details, rules, and custom rewards for the new challenge."
      />
      <CreateContest />
    </section>
  );
};

export default CreateContestPage;
