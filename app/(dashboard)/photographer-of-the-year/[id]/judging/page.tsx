import PotyJudging from '@/components/modules/poty/PotyJudging';

const PhotographerOfTheYearJudgingPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <section className="dashboard-page">
      <PotyJudging contestId={id} />
    </section>
  );
};

export default PhotographerOfTheYearJudgingPage;
