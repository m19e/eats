import { useEffect, useState } from "preact/hooks";

import type { CalendarID } from "/types/builder.ts";
import { updateQuery } from "utils/signals.ts";

import { DateSelect } from "/components/DateSelect.tsx";

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

type CalendarData = {
  y: string;
  m: string;
  d: string;
  skip: boolean;
};

type Props = {
  id: CalendarID;
};

export const Calendar = ({ id }: Props) => {
  const [calendar, setCalendar] = useState<CalendarData>({
    y: "2023",
    m: "1",
    d: "1",
    skip: true,
  });

  useEffect(() => {
    if (calendar.skip) return;

    const { y, m, d } = calendar;
    const ymd = `${y}-${m}-${d}`;
    const query = `${id}:${ymd}`;

    updateQuery({ id, query });
  }, [calendar]);

  const updateCalendar = (data: Partial<CalendarData>) => {
    setCalendar((prev) => ({ ...prev, ...data, skip: false }));
  };

  return (
    <div class="flex gap-1 w-[12rem]">
      <div class="w-[5rem]">
        <DateSelect
          times={[...range(2006, 2023)].reverse()}
          onChange={(value) => updateCalendar({ y: value })}
        />
      </div>
      <div class="w-[3.5rem]">
        <DateSelect
          times={[...range(1, 12)]}
          onChange={(value) => updateCalendar({ m: value })}
        />
      </div>
      <div class="w-[3.5rem]">
        <DateSelect
          times={[...range(1, 31)]}
          onChange={(value) => updateCalendar({ d: value })}
        />
      </div>
    </div>
  );
};
