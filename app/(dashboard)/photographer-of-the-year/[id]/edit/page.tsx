import UpdateContest from '@/components/modules/content/UpdateContest';

const EditPhotographerOfTheYearPage = () => {
  return (
    <section className="dashboard-page min-h-[calc(100dvh-56px)]">
      <UpdateContest returnTo="/photographer-of-the-year" />
    </section>
  );
};

export default EditPhotographerOfTheYearPage;
