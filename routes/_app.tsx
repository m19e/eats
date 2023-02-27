import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  const title = "EATS | Easy Advanced Twitter Search";
  const desc = "URL builder for Twitter advanced search";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <link rel="stylesheet" href={asset("/globals.css")} />
      </Head>
      <div class="font-default">
        <props.Component />
      </div>
    </>
  );
}
