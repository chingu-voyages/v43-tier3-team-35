import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { LoginInput } from "../components/LoginInput";
import { LogoLarge } from "../components/SVGs";
import * as yup from "yup";

export default function SignUp() {
  const { handleSubmit, values, handleChange, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      onSubmit: (values) => console.log(values),
      validationSchema: yup.object({
        username: yup.string().required("Can't be empty"),
        email: yup
          .string()
          .required("Can't be empty")
          .email("Invalid Email Address"),
        password: yup
          .string()
          .required("Can't be empty")
          .min(8, "Must have at least 8 characters"),
        confirmPassword: yup
          .string()
          .required("Can't be empty")
          .oneOf([yup.ref("password")], "Passwords must match"),
      }),
    });
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-900 p-4">
      <LogoLarge className="mb-10" />
      <div className="bg-gray-800 rounded-[20px] p-8 max-w-[400px]">
        <h1 className="text-hl mb-10">Sign Up</h1>
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
            variant={errors.username && touched.username ? "error" : "default"}
            errorMessage={errors.username}
            onChange={handleChange}
            value={values.username}
            name="username"
            onBlur={handleBlur}
            placeholder="Username"
            aria-label="Username"
            className="w-full mb-6"
          />

          <LoginInput
            variant={errors.password && touched.password ? "error" : "default"}
            errorMessage={errors.password}
            onChange={handleChange}
            value={values.password}
            name="password"
            onBlur={handleBlur}
            placeholder="Password"
            aria-label="Password"
            type="password"
            className="w-full mb-10"
          />

          <LoginInput
            variant={
              errors.confirmPassword && touched.confirmPassword
                ? "error"
                : "default"
            }
            errorMessage={errors.confirmPassword}
            onChange={handleChange}
            value={values.confirmPassword}
            name="confirmPassword"
            onBlur={handleBlur}
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
        </form>
      </div>
    </div>
  );
}
