import React from "react";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.handleResetPassword = this.handleResetPassword.bind(this);
  }

  handleResetPassword(e) {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${sessionStorage.getItem("token")}`
    );
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      changePassword: e.currentTarget.newPassword.value,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/change-changePassword", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        window.location.href = "/login";
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <form onSubmit={this.handleResetPassword}>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input type="password" id="newPassword" name="newPassword" required />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    );
  }
}

export default ResetPassword;
