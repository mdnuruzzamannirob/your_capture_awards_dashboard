import Title from '@/components/common/Title';
import ReportManagement from '@/components/modules/report/ReportManagement';

const ReportsPage = () => {
  return (
    <section className="dashboard-page space-y-5">
      <Title
        title="Reports"
        description="Review reported users, check the reason and any linked photo, and take action"
      />

      <ReportManagement />
    </section>
  );
};

export default ReportsPage;
