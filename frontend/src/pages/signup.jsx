import { SignupForm } from "@/components/auth/signup-form";
import { Footer } from "@/components/landing-page/footer";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-center">
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}