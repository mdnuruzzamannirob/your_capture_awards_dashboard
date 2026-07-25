import CreateContest from '@/components/modules/content/CreateContest';

const CreateContestPage = () => {
  return (
    <section className="min-h-[calc(100dvh-57px)] px-[clamp(15px,3vw,50px)] pt-[35px] pb-[70px] [background:radial-gradient(circle_at_75%_5%,color-mix(in_oklab,var(--primary)_7%,transparent),transparent_22rem),var(--background)]">
      <CreateContest />
    </section>
  );
};

export default CreateContestPage;
