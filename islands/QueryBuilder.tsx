import type { CategoryData } from "types/builder.ts";
import { datas } from "consts/builder.ts";

import { Command } from "components/Command.tsx";

const QueryBuilder = () => {
  return (
    <>
      {
        // <Command id="@" title="@" noColon>
        //   <input type="text" placeholder="screen name" class="border px-2" />
        // </Command>
      }

      {/* <Command id="until_time" title="until_time"></Command> */}
      {/* <Command id="since_time" title="since_time"></Command> */}
      {/* <Command id="since_id" title="since_id"></Command> */}
      {/* <Command id="max_id" title="max_id"></Command> */}
      {/* <Command id="within_time" title="within_time"></Command> */}

      <Categories />
    </>
  );
};

const Categories = () => {
  const categories = datas.map(({ title, commands }) => (
    <div key={title} class="space-y-2 sm:space-y-3">
      <Category title={title} />
      <Commands commands={commands} />
    </div>
  ));

  return <>{categories}</>;
};

const Category = ({ title }: Pick<CategoryData, "title">) => {
  return <h2 class="text-xl text-gray-800 font-semibold">{title}</h2>;
};

const Commands = ({ commands }: Pick<CategoryData, "commands">) => {
  const cmds = commands.map((cmd) => (
    <Command
      key={cmd.id}
      {...cmd}
    />
  ));

  return <>{cmds}</>;
};

export default QueryBuilder;
