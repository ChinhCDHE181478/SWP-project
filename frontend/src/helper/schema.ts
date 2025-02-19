import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(2, {
      message: "Tài khoản phải có ít nhất 2 ký tự",
    }),
    password: z
      .string()
      .min(4, { message: "Mật khẩu phải có ít nhất 4 ký tự" })
      .regex(/[A-Z]/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa",
      })
      .regex(/[a-z]/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường",
      })
      .regex(/[\W_]/, {
        message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Tài khoản không được bỏ trống",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được bỏ trống",
  }),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  gender: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  grade: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  province: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  district: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  ward: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  birthDate: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  educationLevel: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
});
