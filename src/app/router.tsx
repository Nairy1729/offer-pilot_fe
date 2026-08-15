import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { LandingPage } from "../features/auth/pages/LandingPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { SignupPage } from "../features/auth/pages/SignupPage";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/pages/ResetPasswordPage";
import { ApplicationsPage } from "../features/applications/pages/ApplicationsPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { GoalsPage } from "../features/goals/pages/GoalsPage";
import { LearningPage } from "../features/learning/pages/LearningPage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { ResumePage } from "../features/resume/pages/ResumePage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import { APP_ROUTES } from "../lib/constants";

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME,
    element: <LandingPage />,
  },
  {
    path: APP_ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: APP_ROUTES.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: APP_ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: APP_ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: APP_ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: APP_ROUTES.GOALS,
        element: <GoalsPage />,
      },
      {
        path: APP_ROUTES.LEARNING,
        element: <LearningPage />,
      },
      {
        path: APP_ROUTES.APPLICATIONS,
        element: <ApplicationsPage />,
      },
      {
        path: APP_ROUTES.RESUME,
        element: <ResumePage />,
      },
      {
        path: APP_ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: APP_ROUTES.SETTINGS,
        element: <SettingsPage />,
      },
    ],
  },
]);