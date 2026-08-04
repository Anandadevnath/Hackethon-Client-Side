import { StatItem } from './common/StatItem';
import { useLanguage } from '../context/LanguageContext';

export default function StatsSection(){
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  return (
    <section className="py-20 px-4 bg-green-50">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatItem value="4.5M" label={isBn ? 'সংরক্ষিত টন' : 'Tonnes Saved'} subLabel={isBn ? 'বার্ষিক লক্ষ্য' : 'Annual Target'} />
        <StatItem value="$1.5B" label={isBn ? 'অর্থনৈতিক মূল্য' : 'Economic Value'} subLabel={isBn ? 'প্রতিবছর সুরক্ষিত' : 'Protected Annually'} />
        <StatItem value="10K+" label={isBn ? 'সাহায্যপ্রাপ্ত কৃষক' : 'Farmers Helped'} subLabel={isBn ? 'এবং বাড়ছে' : 'And Growing'} />
      </div>
    </section>
  );
}
