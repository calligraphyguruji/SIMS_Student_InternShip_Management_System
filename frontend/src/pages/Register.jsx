import React, { useState } from "react";
import { Link, useNavigate } from "../router.jsx";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { ErrorBanner } from "../components/ui/Feedback.jsx";
import SIMSLogo from "../components/ui/SIMSLogo.jsx";

const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty Mentor" },
  { value: "company", label: "Company HR" },
  { value: "coordinator", label: "Internship Coordinator" },
];

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { role: "student" } });

  const onSubmit = async (values) => {
    setServerError("");
    setSubmitting(true);
    try {
      await registerUser(values);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Unable to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 dark:bg-ink-950 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-3">
            <SIMSLogo size={48} withText textClassName="text-2xl" />
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-ink-50">Create your account</h1>
          <p className="text-sm text-ink-400 mt-1">Join the internship registry</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <ErrorBanner message={serverError} />

          <div>
            <label className="label">I am a</label>
            <select className="input" {...register("role")}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Full name</label>
            <input className="input" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input type="email" className="input" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input pr-10"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-xs text-ink-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
