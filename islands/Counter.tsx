import { useState } from "preact/hooks";
import { Button } from "/components/Button.tsx";

interface CounterProps {
  start: number;
}

const Counter = (props: CounterProps) => {
  const [count, setCount] = useState(props.start);
  return (
    <div class="flex gap-2 w-full">
      <p class="flex-grow-1 font-bold text-xl">{count}</p>
      <Button onClick={() => setCount((prev) => prev - 1)}>-1</Button>
      <Button onClick={() => setCount((prev) => prev + 1)}>+1</Button>
    </div>
  );
};

export default Counter;
