import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const categories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/categories" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
  }),
});

const instructors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/instructors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      photo: image().optional(),
      linkedin: z.string().url().optional(),
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      quote: z.string(),
      photo: image().optional(),
      course: reference("courses").optional(),
      rating: z.number().min(1).max(5).default(5),
      featured: z.boolean().default(false),
    }),
});

const companies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/companies" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: image(),
      url: z.string().url().optional(),
    }),
});

const courses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/courses" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      shortDescription: z.string(),
      category: reference("categories"),
      level: z.enum(["Iniciación", "Intermedio", "Avanzado"]),
      duration: z.string(),
      modality: z.enum(["Online en directo", "Online a tu ritmo", "Mixta"]),
      tutor: reference("instructors"),
      coverImage: image(),
      videoUrl: z.string().url().optional(),
      objectives: z.array(z.string()),
      contents: z.array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
        }),
      ),
      hasFinalProject: z.boolean().default(false),
      certificate: z.enum(["Diploma privado", "Certificado profesional"]),
      faq: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      ),
      relatedCourses: z.array(reference("courses")).default([]),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

export const collections = {
  categories,
  instructors,
  testimonials,
  companies,
  courses,
};
