const SectionWrapper = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
    <h2 className="text-xl font-bold text-[#0F2A5D] mb-8 border-b border-gray-50 pb-4">{title}</h2>
    {children}
  </div>
);
export default SectionWrapper;