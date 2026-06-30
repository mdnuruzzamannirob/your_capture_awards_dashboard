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
import UpdateContest from '@/components/modules/content/UpdateContest';

const UpdateContestPage = () => {
  return (
    <section className="space-y-5 p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link href="/contest">Contest</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Update Contest</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Title
        title="Update Contest"
        description="Modify details, rules, and custom rewards for the existing challenge."
      />
      <UpdateContest />
    </section>
  );
};

export default UpdateContestPage;
