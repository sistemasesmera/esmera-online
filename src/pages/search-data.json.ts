import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const courses    = await getCollection("courses");
  const categories = await getCollection("categories");

  const data = courses.map((course) => {
    const catNames = course.data.categories
      .map((ref) => categories.find((c) => c.id === ref.id)?.data.name ?? "")
      .filter(Boolean)
      .join(", ");

    return {
      id:          course.id,
      title:       course.data.title,
      description: course.data.shortDescription,
      category:    catNames,
      duration:    course.data.duration,
      level:       course.data.level,
      price:       course.data.price,
    };
  });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
