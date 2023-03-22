import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { LoginInput } from "../components/LoginInput";
import { LogoLarge } from "../components/SVGs";

export default function SignUp() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-900 px-4">
      <LogoLarge className="mb-10" />
      <div className="bg-gray-800 rounded-[20px] p-8 max-w-[400px]">
        <h1 className="text-hl mb-10">Sign Up</h1>
        <LoginInput
          placeholder="Email address"
          aria-label="Email address"
          className="w-full mb-6"
          type="email"
        />
        <LoginInput
          placeholder="Username"
          aria-label="Username"
          className="w-full mb-6"
        />

        <LoginInput
          placeholder="Password"
          aria-label="Password"
          type="password"
          className="w-full mb-10"
        />

        <LoginInput
          placeholder="Repeat Password"
          aria-label="Repeat Password"
          type="password"
          className="w-full mb-10"
        />
        <Button className="w-full mb-6 text-center">Create an account</Button>
        <p className="text-bodym text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
