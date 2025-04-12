"use server";

import { db } from "@/db";
import { createClient } from "@/utils/supabase/server";

export const getAuthStatus = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  console.log("user", user);

  if (!user?.id || !user.email) {
    throw new Error("Invalid user data");
  }

  const existingUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });
  }

  return { success: true };
};
