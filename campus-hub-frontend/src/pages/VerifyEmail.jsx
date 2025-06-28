// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      setMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login?verified=true");
      }, 2000);
    } else if (status === "error") {
      setMessage("Verification failed. Invalid or expired token.");
    } else {
      setMessage("Invalid verification link.");
    }
  }, [navigate]);

  return (
    <div className="verify-container">
      <h2>{message}</h2>
    </div>
  );
}

export default VerifyEmail;


//     if (!token) {
//       setMessage("Invalid verification link.");
//       return;
//     }

//     axios
//       .get(`http://localhost:8080/api/auth/verify-email?token=${token}`)
//       .then(() => {
//         setMessage("Email verified! Redirecting to login...");
//         setTimeout(() => {
//           navigate("/login?verified=true");
//         }, 2000);
//       })
//       .catch((err) => {
//         console.error("Verification error:", err);
//         setMessage("Verification failed. Invalid or expired token.");
//       });
//   }, [navigate]);

//   return (
//     <div className="verify-container">
//       <h2>{message}</h2>
//     </div>
//   );
// }

// export default VerifyEmail;
