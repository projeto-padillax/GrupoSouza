// "use server";

// import { z } from "zod";
// import { prisma } from "../neon/db";
// import { User as UserORM } from "@prisma/client";
// import bcrypt from "bcrypt";
// import { UserInput } from "@/components/admin/userForm";

// const userserverSchema = z.object({
//     status: z.boolean(),
//     name: z
//         .string()
//         .min(1, "Nome é obrigatório.")
//         .max(100, "Nome deve ter no máximo 100 caracteres."),
//     email: z
//         .string().check(z.email()).refine((email) => email.toLowerCase().endsWith(".com") || email.endsWith(".br"), {
//             message: "Email invalido",
//         }),
//     telefone: z
//         .string()
//         .min(1, "Telefone é obrigatório.")
//         .max(15, "Telefone deve ter no máximo 15 caracteres."),
//     login: z.
//         string()
//         .min(1, "Login é obrigatório.")
//         .max(11, "Login deve ter no máximo 11 caracteres."),

//     perfil: z.enum({
//         "ADMIN": "ADMIN",
//         "CORRETOR": "CORRETOR",
//         "SUPERADMIN": "SUPERADMIN",
//     },
//         {
//             message: "Perfil deve ser ADMIN, CORRETOR ou SUPERADMIN.",
//         }
//     ),
//     senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
// });

// // const loginSchema = z.object({
// //     login: z.string().nonempty("Login é obrigatório."),
// //     senha: z.string().nonempty("Senha é obrigatória.")
// // });

// const idsSchema = z.array(z.cuid());
// const idSchema = z.cuid();

// export async function getAllUsers(): Promise<UserORM[]> {
//     return await prisma.user.findMany();
// }

// export async function findUser(id: string): Promise<UserORM | null> {
//     // Validar ID
//     const validId = idSchema.parse(id);
//     return await prisma.user.findUnique({ where: { id: validId } });
// }

// const updateUserSchema = userserverSchema.partial().extend({
//     senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional()
// });

// export async function createUser({
//     name,
//     email,
//     telefone,
//     perfil,
//     status = true,
//     login,
//     senha
// }: UserInput) {
//     const validatedData = userserverSchema.parse({
//         name,
//         email,
//         telefone,
//         perfil,
//         status,
//         login,
//         senha
//     });

//     const hashedPassword = await bcrypt.hash(validatedData.senha, 10);

//     await prisma.user.create({
//         data: {
//             name: validatedData.name,
//             email: validatedData.email,
//             telefone: validatedData.telefone,
//             perfil: validatedData.perfil,
//             status: validatedData.status,
//             login: validatedData.login,
//             senha: hashedPassword,
//         },
//     });
// }

// export async function updateUser(User: Omit<UserORM, "createdAt">) {
//     const { id, ...UserWithoutId } = User;

//     // Validar ID
//     const validId = idSchema.parse(id);

//     // Validar dados do User
//     const validatedData = updateUserSchema.parse({
//         ...UserWithoutId,
//     });

//     if (validatedData.senha) {
//         validatedData.senha = await bcrypt.hash(validatedData.senha, 10);
//     }

//     await prisma.user.update({
//         where: { id: validId },
//         data: validatedData,
//     });
// }

// export async function activateUsers(ids: string[]) {
//     // Validar IDs
//     const validIds = idsSchema.parse(ids);

//     await prisma.$transaction(
//         validIds.map((id) =>
//             prisma.user.update({ where: { id }, data: { status: true } })
//         )
//     );
// }

// export async function deactivateUsers(ids: string[]) {
//     // Validar IDs
//     const validIds = idsSchema.parse(ids);

//     await prisma.$transaction(
//         validIds.map((id) =>
//             prisma.user.update({ where: { id }, data: { status: false } })
//         )
//     );
// }

// export async function deleteUsers(ids: string[]) {
//     // Validar IDs
//     const validIds = idsSchema.parse(ids);

//     await Promise.all(
//         validIds.map((id) => prisma.user.deleteMany({ where: { id } }))
//     );
// }
