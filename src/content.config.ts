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
      internalCode: z.string().optional(),
      shortDescription: z.string(),
      categories: z.array(reference("categories")).min(1),
      level: z.enum(["Iniciación", "Intermedio", "Avanzado"]),
      duration: z.string(),
      modality: z.literal("Online"),
      tutor: reference("instructors"),
      coverImage: image(),
      videoUrl: z.string().url().optional(),
      objectives: z.array(
        z.object({
          text: z.string(),
          icon: z.enum([
            "sparkles",
            "shield",
            "megaphone",
            "users",
            "calendar",
            "briefcase",
            "refresh",
            "compass",
            "chat",
            "send",
            "bot",
            "award",
            "clock",
            "chart",
            "target",
            "alert",
          ]),
        }),
      ),
      contents: z.array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
        }),
      ),
      hasFinalProject: z.boolean().default(false),
      certificate: z.enum(["Diploma privado", "Certificado profesional"]),
      careerOutcomes: z
        .array(
          z.object({
            title: z.string(),
            description: z.string().optional(),
          }),
        )
        .optional(),
      certificadoProfesionalidad: z
        .object({
          codigo: z.string(),
          nombre: z.string(),
          familia: z.string(),
          nivel: z.enum(["Nivel 1", "Nivel 2", "Nivel 3"]),
          estado: z.enum(["Vigente", "En proceso de homologación"]).default("Vigente"),
        })
        .optional(),
      faq: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      ),
      relatedCourses: z.array(reference("courses")).default([]),
      price: z.number().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      publishDate: z.date(),
      readingTime: z.string(),
      author: reference("instructors"),
      coverImage: image(),
      featured: z.boolean().default(false),
    }),
});

export const collections = {
  categories,
  instructors,
  testimonials,
  companies,
  courses,
  blog,
};
