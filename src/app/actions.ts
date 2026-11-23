"use server";

import { revalidatePath } from "next/cache";

export async function revalidateBookPages() {
  revalidatePath("/books");
  revalidatePath("/books/[id]", "page");
}
