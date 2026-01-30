import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background bg-grid p-4 transition-colors duration-300">
      <LoginForm />
    </main>
  );
}