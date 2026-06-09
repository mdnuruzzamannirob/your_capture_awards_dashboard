import Title from '@/components/common/Title';
import SupportManagement from '@/components/modules/support/SupportManagement';

const ContactSupport = () => {
  return (
    <section className="space-y-5 p-5">
      <Title
        title="Support Management"
        description="Manage and track all support tickets from your users"
      />

      <SupportManagement />
    </section>
  );
};

export default ContactSupport;
