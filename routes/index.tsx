import { Head } from "$fresh/runtime.ts";
import Scene from "../islands/Scene.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to my scene</title>
        <link rel="stylesheet" href="style.css" />
      </Head>
      <div className="container">
        <Scene />
      </div>
    </>
  );
}
