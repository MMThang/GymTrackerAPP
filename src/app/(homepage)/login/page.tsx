import FormComponent from "../../components/form/formComponent";
import InputComponent from "../../components/form/inputComponent";
import { login } from "../../actions/user-actions";
import { Button } from "@/app/components/buttons/button";
import { GoogleAuthButton } from "@/app/components/buttons/googleAuthButton";
import { Icons } from "@/app/components/icons";

export default function Login() {
  return (
    <div className="auth-page login-page">
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
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue to GymTracker</p>
          </div>

          <FormComponent onSubmit={login} redirectTo="/calendar">
            <div className="form-body">
              <div className="input-wrapper">
                <div className="input-icon">
                  <Icons.User />
                </div>
                <InputComponent
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  type="password"
                  errorTxt="Password is required"
                />
              </div>
            </div>

            <div className="form-footer">
              <Button p="Sign In" type="submit" className="primary-btn" />

              <div className="divider">
                <span>or</span>
              </div>

              <GoogleAuthButton />

              <div className="additional-btn">
                <p>New to GymTracker?</p>
                <Button
                  href="register"
                  p="Create Account"
                  btnType="text"
                  type="redirect"
                  className="secondary-btn"
                />
              </div>
            </div>
          </FormComponent>
        </div>

        <div className="auth-footer">
          <p>© 2024 GymTracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
