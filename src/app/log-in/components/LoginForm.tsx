'use client';

import { useState } from 'react';
import { z } from 'zod';

const loginFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
});

type LoginFormData = z.infer<typeof loginFormSchema>;

const getFieldData = () => ({
    name: {
        schema: loginFormSchema.shape.name,
        getValue: (formData: FormData) => formData.get('name') as string
    },
    username: {
        schema: loginFormSchema.shape.username,
        getValue: (formData: FormData) => formData.get('username') as string
    },
    password: {
        schema: loginFormSchema.shape.password,
        getValue: (formData: FormData) => formData.get('password') as string
    }
});

export default function LoginForm() {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (name: string, value: string) => {
        const fieldData = getFieldData();
        const field = fieldData[name as keyof typeof fieldData];

        if (!field) return;

        const result = field.schema.safeParse(value);
        setErrors(prev => ({
            ...prev,
            [name]: !result.success ? result.error.issues[0].message : ""
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const fieldData = getFieldData();
        const data = Object.entries(fieldData).reduce((acc, [key, field]) => ({
            ...acc,
            [key]: field.getValue(formData)
        }), {});

        const result = loginFormSchema.safeParse(data);
        if (!result.success) {
            const formattedErrors: { [key: string]: string } = {};
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        setErrors({});
        // Dummy submit function
        console.log('Form submitted:', result.data);
    };

    return (
        <div className="flex flex-col w-full max-w-md p-8 rounded-2xl bg-[#EAE9DC]/90 backdrop-blur-md shadow-lg">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-neutralBackgroundColorInverted mb-8">Log In</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        onChange={(e) => validateField("name", e.target.value)}
                        className={`w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm text-neutralBackgroundColorInverted placeholder-neutralBackgroundColorInverted/70 border-2 focus:outline-none ${errors.name ? 'border-red-500' : 'border-transparent'}`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        onChange={(e) => validateField("username", e.target.value)}
                        className={`w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm text-neutralBackgroundColorInverted placeholder-neutralBackgroundColorInverted/70 border-2 focus:outline-none ${errors.username ? 'border-red-500' : 'border-transparent'}`}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={(e) => validateField("password", e.target.value)}
                        className={`w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm text-neutralBackgroundColorInverted placeholder-neutralBackgroundColorInverted/70 border-2 focus:outline-none ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full p-3 rounded-lg bg-neutralBackgroundColorInverted text-fontColorInverted font-semibold hover:bg-neutralBackgroundColorInverted/90 transition-colors duration-200"
                >
                    Sign in
                </button>

                <p className="text-center text-sm text-neutralBackgroundColorInverted/70 mt-4">
                    Don't have an account? <a href="#" className="text-neutralBackgroundColorInverted font-semibold hover:underline">Sign up, it's free!</a>
                </p>
            </form>
        </div>
    );
}