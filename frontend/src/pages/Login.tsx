import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { LoginInput } from "../components/LoginInput";
import { LogoLarge } from "../components/SVGs";
import * as yup from "yup";
export default function Login() {
  const { handleSubmit, values, handleChange, handleBlur, errors, touched } =
    useFormik({
      initialValues: { email: "", password: "" },
      onSubmit: (values) => console.log(values),
      validationSchema: yup.object({
        email: yup
          .string()
          .required("Can't be empty")
          .email("Invalid Email Address"),
        password: yup.string().required("Can't be empty"),
      }),
    });
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-900 px-4">
      <LogoLarge className="mb-10" />
      <div className="bg-gray-800 rounded-[20px] p-8 max-w-[400px]">
        <h1 className="text-hl mb-10">Login</h1>
        <form onSubmit={handleSubmit}>
          <LoginInput
            variant={errors.email && touched.email ? "error" : "default"}
            errorMessage={errors.email}
            onChange={handleChange}
            value={values.email}
            name="email"
            onBlur={handleBlur}
            placeholder="Email address"
            aria-label="Email address"
            className="w-full mb-6"
            type="email"
          />
          <LoginInput
            variant={errors.password && touched.password ? "error" : "default"}
            errorMessage={errors.password}
            value={values.password}
            onChange={handleChange}
            name="password"
            placeholder="Password"
            aria-label="Password"
            type="password"
            className="w-full mb-10"
            onBlur={handleBlur}
          />
          <Button type="submit" className="w-full mb-6 text-center">
            Login to your account
          </Button>
          <p className="text-bodym text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
