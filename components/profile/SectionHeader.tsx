interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="bg-blue-100 px-4 py-3 rounded-t border-b-2 border-blue-200 -mx-4 -mt-4 mb-4">
      <h3 className="text-sm font-semibold text-blue-900">{title}</h3>
    </div>
  );
}
