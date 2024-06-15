import { ManageMessages } from "./ManageMessages"

export default async function Home() {
  await delay(200)
  return (
    <main>
      {Math.random()}
      <ManageMessages />
    </main>
  );
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

