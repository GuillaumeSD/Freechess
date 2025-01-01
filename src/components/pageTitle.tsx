import Head from "next/head";

export const PageTitle = ({ title }: { title: string }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
    </Head>
  );
};
