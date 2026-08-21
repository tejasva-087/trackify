import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "react-hot-toast";

import Landing from "./pages/Landing";
import AuthLayout from "./ui/AuthLayout";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import EmailVerification from "./pages/EmailVerification";

import AuthGuard from "./features/authentication/AuthGuard";
import GuestGuard from "./features/authentication/GuestGuard";

import AppLayout from "./ui/AppLayout";
import Application from "./pages/Application";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          {/* <Route element={<GuestGuard />}> */}
          {/* STATIC PAGES */}
          <Route path="/" element={<Landing />} />

          {/* AUTH PAGES */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          {/* </Route> */}

          {/* APPLICATION PAGES */}
          <Route
            element={
              // <AuthGuard>
              <AppLayout />
              // </AuthGuard>
            }
          >
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/application" element={<Application />} />
          </Route>

          {/* CATCH-ALL */}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "9px 18px",
            backgroundColor: "var(--color-primary-tint)",
            color: "var(--color-primary)",
            border: "var(--color-primary) solid 1px",
          },
          success: {
            duration: 3000,
            style: {
              backgroundColor: "var(--color-success-tint)",
              color: "var(--color-success)",
              border: "var(--color-success) solid 1px",
            },
          },
          error: {
            duration: 5000,
            style: {
              backgroundColor: "var(--color-danger-tint)",
              color: "var(--color-danger)",
              border: "var(--color-danger) solid 1px",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
