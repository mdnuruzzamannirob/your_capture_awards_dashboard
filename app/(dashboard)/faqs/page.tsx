import Title from '@/components/common/Title';
import FaqManagement from '@/components/modules/faq/FaqManagement';

const FaqsPage = () => {
  return (
    <section className="dashboard-page space-y-5">
      <Title title="FAQ Management" description="Create, order, publish, and update website FAQs" />
      <FaqManagement />
    </section>
  );
};

export default FaqsPage;
