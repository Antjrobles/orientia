import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MultiSelectWithChipsProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function MultiSelectWithChips({
  value = [],
  onChange,
  options,
  placeholder = "Selecciona una opción",
}: MultiSelectWithChipsProps) {
  const handleSelect = (selectedValue: string) => {
    if (!value.includes(selectedValue)) {
      onChange([...value, selectedValue]);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(value.filter((_, i) => i !== indexToRemove));
  };

  // Ordenar por número al inicio
  const sortedValues = [...value].sort((a, b) => {
    const numA = parseInt(a.split(".")[0]);
    const numB = parseInt(b.split(".")[0]);
    return numA - numB;
  });

  return (
    <div className="space-y-3">
      <Select value="" onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {sortedValues.length > 0 && (
        <div className="space-y-2">
          {sortedValues.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-emerald-50 p-3 rounded-lg border-2 border-emerald-300"
            >
              <button
                type="button"
                onClick={() => handleRemove(value.indexOf(item))}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors flex-shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <span className="text-sm text-slate-700 font-medium">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
