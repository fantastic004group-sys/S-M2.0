import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/context/AuthContext";

export default function AnalyticsTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Record page view every time path changes
    const recordView = async () => {
      try {
        await addDoc(collection(db, "page_views"), {
          path: location.pathname,
          timestamp: serverTimestamp(),
          userId: user?.uid || "anonymous",
          sessionId: getSessionId(),
        });
      } catch (error) {
        // Silently fail for analytics
        console.error("Tracking error:", error);
      }
    };

    recordView();
  }, [location.pathname, user?.uid]);

  return null;
}

function getSessionId() {
  let sessionId = sessionStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}
