import InputComponent from "../../components/form/inputComponent";
import { Button } from "@/app/components/buttons/button";
import { GoogleAuthButton } from "@/app/components/buttons/googleAuthButton";
import { Icons } from "@/app/components/icons";
import RegisterFormWrapper from "./RegisterFormWrapper";

export default function Register() {
  return (
    <div className="auth-page register-page">
      {/* Animated background elements */}
      <div className="auth-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <div className="logo-icon">
                <Icons.GymTracker />
              </div>
            </div>
            <h1>Create Account</h1>
            <p className="auth-subtitle">
              Join GymTracker and start your fitness journey
            </p>
          </div>

          <RegisterFormWrapper>
            <div className="form-body">
              <div className="input-wrapper">
                <div className="input-icon">
                  <Icons.User />
                </div>
                <InputComponent
                  name="username"
                  label="Username"
                  placeholder="Choose a username"
                  errorTxt="Username is required"
                />
              </div>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Icons.Lock />
                </div>
                <InputComponent
                  name="password"
                  label="Password"
                  placeholder="Create a password"
                  type="password"
                  errorTxt="Password is required"
                />
              </div>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Icons.Lock />
                </div>
                <InputComponent
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  errorTxt="Please confirm your password"
                />
              </div>
            </div>

            <div className="form-footer">
              <Button
                p="Create Account"
                type="submit"
                className="primary-btn"
              />

              <div className="divider">
                <span>or</span>
              </div>

              <GoogleAuthButton />

              <div className="additional-btn">
                <p>Already have an account?</p>
                <Button
                  href="login"
                  p="Sign In"
                  btnType="text"
                  type="redirect"
                  className="secondary-btn"
                />
              </div>
            </div>
          </RegisterFormWrapper>
        </div>

        <div className="auth-footer">
          <p>© 2026 GymTracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
