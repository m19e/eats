type Props = {
  times: number[];
  onChange: (value: string) => void;
};

export const DateSelect = ({ times, onChange }: Props) => {
  const options = times
    .map(
      (time) => <option key={time} value={time}>{time}</option>,
    );

  return (
    <select
      class="px-0.5 rounded border-2 focus:border(twitter) outline-none"
      onChange={(e) => onChange(e.currentTarget.value)}
    >
      {options}
    </select>
  );
};
