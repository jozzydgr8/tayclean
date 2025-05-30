
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../App";

export const AuthHooks = () => {
  const actionCodeSettings = {
    url: '', 
    handleCodeInApp: true, // Ensures you handle reset via your app
  };

  const handleReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent.');
    } catch (error: any) {
      console.error("Reset error:", error.message);
      alert('Failed to send reset email. Check console for details.');
    }
  };

  return { handleReset };
};
