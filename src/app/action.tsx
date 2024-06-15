"use server";

import { revalidatePath } from "next/cache";

export async function addMessage(input: {
  content: string;
  optimisticId: string;
}) {
  await delay(500);
  revalidatePath("/");
  return {
    id: crypto.randomUUID(),
    content: input.content,
    optimisticId: input.optimisticId,
  };
}

export async function deleteMessage(input: { id: string }) {
  await delay(500);
  revalidatePath("/");
  return true;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
