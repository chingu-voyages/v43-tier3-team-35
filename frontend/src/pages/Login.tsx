import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { LoginInput } from "../components/LoginInput";
import { LogoLarge } from "../components/SVGs";

export default function Login() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-900 px-4">
      <LogoLarge className="mb-10" />
      <div className="bg-gray-800 rounded-[20px] p-8 max-w-[400px]">
        <h1 className="text-hl mb-10">Login</h1>
        <LoginInput
          placeholder="Email address"
          aria-label="Email address"
          className="w-full mb-6"
          type="email"
        />
        <LoginInput
          placeholder="Password"
          aria-label="Password"
          type="password"
          className="w-full mb-10"
        />
        <Button className="w-full mb-6 text-center">
          Login to your account
        </Button>
        <p className="text-bodym text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
