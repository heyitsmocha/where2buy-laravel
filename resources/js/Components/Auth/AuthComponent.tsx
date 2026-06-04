import { Input } from "@/Components/ui/input";
import { Field, FieldLabel, FieldError } from "@/Components/ui/field";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import type { Errors } from "@inertiajs/core";
import { useState } from "react";

interface AuthComponentProps {
  onSuccess?: () => void;
  onError?: (error: Errors) => void;
  onModeChange?: (mode: 'login' | 'register') => void;
}

export default function AuthComponent({ onSuccess, onError, onModeChange }: AuthComponentProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
  });

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    onModeChange?.(newMode);
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    post(`/${mode}`, {
      onSuccess: () => {
        if (Object.keys(errors).length === 0) {
          onSuccess?.();
        }
      },
      onError: (error) => {
        console.error('Login failed:', error);
        onError?.(error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm">
      <Field className="mb-4">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} type="email" />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </Field>
      { mode === 'register' && (
        <Field className="mb-4">
          <FieldLabel htmlFor="name">Username</FieldLabel>
          <Input id="name" placeholder="Username" value={data.name} onChange={(e) => setData('name', e.target.value)} type="text" />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>
      )}
      <Field className="mb-4">
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" placeholder="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </Field>
      { mode === 'register' && (
        <Field className="mb-4">
          <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
          <Input id="password_confirmation" placeholder="Confirm Password" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
          {errors.password_confirmation && <FieldError>{errors.password_confirmation}</FieldError>}
        </Field>
      )}
      <Button type="submit" disabled={processing} className="mt-4 w-full">{mode === 'login' ? 'Login' : 'Register'}</Button>
      <p className="mt-4 text-center">
        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
        <a href="#" className="text-blue-500 hover:underline" onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Register here' : 'Login here'}
        </a>.
      </p>
    </form>
  );
}
