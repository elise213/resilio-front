import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
      console.error("❌ No token found in URL");
    } else {
      console.log("✅ Token found:", token);
    }
  }, [token]);

  const cleanToken = token ? token.trim().replace(/^b'|\'$/g, "") : null;

  const handleResetPassword = async () => {
    console.log("🟡 Attempting password reset...");

    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      console.error("❌ Error: Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      console.error("❌ Error: Passwords do not match.");
      return;
    }

    if (!cleanToken) {
      setError("Invalid or expired token.");
      console.error("❌ Error: Token is missing.");
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Clean Token being sent:", cleanToken);
      console.log("🔍 Password being sent:", newPassword);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/change-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      console.log("📩 Server Response Status:", response.status);

      // Ensure response is JSON before parsing
      let result;
      try {
        result = await response.json();
      } catch (err) {
        throw new Error("Server returned invalid response.");
      }

      console.log("📩 Full Server Response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password. Try again.");
      }

      setSuccess(true);
      console.log("✅ Password reset successful. Redirecting...");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("❌ Error resetting password:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>

      {error && <p className="error-message">{error}</p>}
      {success ? (
        <p className="success-message">
          Password reset successfully! Redirecting...
        </p>
      ) : (
        <>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
