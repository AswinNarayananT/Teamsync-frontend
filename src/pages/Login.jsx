import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser, googleLogin } from "../redux/auth/authActions";
import { FcGoogle } from "react-icons/fc";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useGoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.is_superuser) {
        navigate("/adminpanel");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: (response) => {
      dispatch(googleLogin(response.access_token, navigate));
    },
    onError: (error) => {
    },
    flow: "implicit",
  });

  const validationSchema = Yup.object({
    first_name: isLogin
      ? Yup.string().notRequired()
      : Yup.string().required("First name is required"),
    last_name: isLogin
      ? Yup.string().notRequired()
      : Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone_number: isLogin
      ? Yup.string().notRequired()
      : Yup.string()
          .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
          .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: isLogin
      ? Yup.string().notRequired()
      : Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm password is required"),
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Elements - More subtle and darker */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-900/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card Container - Darker */}
        <div className="bg-gray-950/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-3xl font-extrabold text-center text-white bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-center text-gray-500 text-sm">
              {isLogin ? "Sign in to access your account" : "Join us today and get started"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mb-4 p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form Section */}
          <div className="px-8 pb-8">
            <Formik
              initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                phone_number: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                if (isLogin) {
                  dispatch(loginUser({ email: values.email, password: values.password }, navigate));
                } else {
                  dispatch(
                    registerUser(
                      {
                        first_name: values.first_name,
                        last_name: values.last_name,
                        email: values.email,
                        phone_number: values.phone_number,
                        password: values.password,
                      },
                      navigate
                    )
                  );
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {!isLogin && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Field
                          type="text"
                          name="first_name"
                          placeholder="First Name"
                          className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                        />
                        <ErrorMessage name="first_name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div>
                        <Field
                          type="text"
                          name="last_name"
                          placeholder="Last Name"
                          className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                        />
                        <ErrorMessage name="last_name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div>
                      <Field
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number"
                        className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                      />
                      <ErrorMessage name="phone_number" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  )}

                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {!isLogin && (
                    <div>
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-3 rounded-lg font-semibold transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center"
                    disabled={loading || isSubmitting}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      isLogin ? "Sign In" : "Create Account"
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Divider */}
            <div className="my-6 flex items-center justify-center gap-2">
              <div className="h-px w-full bg-gray-800"></div>
              <p className="text-sm text-gray-600 px-2">OR</p>
              <div className="h-px w-full bg-gray-800"></div>
            </div>

            {/* Social Login */}
            <button
              className="w-full flex items-center justify-center gap-3 border border-gray-800 bg-gray-900 p-3 rounded-lg hover:bg-gray-800 transition-all duration-200"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="text-xl" />
              <span className="text-gray-300">Continue with Google</span>
            </button>

            {/* Toggle Login/Signup */}
            <p className="text-center mt-6 text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                className="text-blue-500 hover:text-blue-400 ml-2 font-medium hover:underline focus:outline-none transition-colors"
                onClick={() => setIsLogin(!isLogin)}
                type="button"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}