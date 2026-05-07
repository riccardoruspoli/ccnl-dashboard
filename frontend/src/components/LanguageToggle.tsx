import type { Language } from "../types";

interface LanguageToggleProps {
  language: Language;
  label: string;
  onChange: (language: Language) => void;
}

export function LanguageToggle({
  language,
  label,
  onChange,
}: Readonly<LanguageToggleProps>) {
  const options: Array<{ label: string; value: Language }> = [
    { label: "EN", value: "en" },
    { label: "IT", value: "it" },
  ];

  return (
    <div className="grid w-fit max-w-full gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
      <span>{label}</span>
      <div
        className="inline-flex h-10 w-fit max-w-full rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800"
        role="group"
        aria-label={label}
      >
        {options.map((option) => (
          <button
            key={option.value}
            className={`min-w-12 rounded-md px-3 text-sm font-semibold transition ${
              language === option.value
                ? "bg-white text-blue-700 shadow-sm dark:bg-slate-950 dark:text-blue-300"
                : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
            type="button"
            aria-pressed={language === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
