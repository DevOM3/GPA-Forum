import React from "react";
import loginStyles from "../../styles/pages/auth/Login.module.css";

const Login = () => {
  return (
    <div className={loginStyles.login}>
      <form className={loginStyles.form}>
        <img src="/images/circle.svg" alt="" />
        {/* <div className={loginStyles.mainForm}></div> */}
      </form>
    </div>
  );
};
export default Login;
