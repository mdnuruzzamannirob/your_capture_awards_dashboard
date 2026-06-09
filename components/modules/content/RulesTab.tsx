'use client';

const RulesTab = ({ contest }: { contest: any }) => {
  return (
    <div className="w-full">
      <div className="space-y-5">
        {contest?.rules?.length ? (
          contest.rules.map((rule: any, index: number) => (
            <div key={index} className="space-y-2 border-t py-6 first:border-t-0 first:pt-0">
              <h3 className="text-xl font-semibold">{rule?.name}</h3>
              <p className="text-muted-foreground">{rule?.description}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No rules available for this contest.</p>
        )}
      </div>
    </div>
  );
};

export default RulesTab;
