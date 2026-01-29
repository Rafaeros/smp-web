import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 bg-[radial-gradient(#2596be15_1px,transparent_1px)] [bg-size:20px_20px] p-4">
      <LoginForm />
    </main>
  );
}