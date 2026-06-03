import { Input } from "@/Components/ui/input";
import { Field, FieldLabel } from "@/Components/ui/field";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";

export default function AuthComponent() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    post('/api/login', {
      onSuccess: () => {
        console.log('Login successful');
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} type="email" />
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" placeholder="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
      </Field>
      <Button type="submit" disabled={processing} className="mt-4 w-full">Login</Button>
      <p className="mt-4 text-center">Don't have an account? <a href="#" className="text-blue-500 hover:underline">Register here</a>.</p>
    </form>
  );
}
