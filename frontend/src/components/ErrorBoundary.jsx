import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Surfaces in the browser console with a full component stack
    console.error("SIMS crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6fa", padding: 24 }}>
          <div style={{ maxWidth: 640, background: "white", border: "1px solid #e6eaf2", borderRadius: 8, padding: 24, fontFamily: "monospace" }}>
            <p style={{ fontWeight: 600, color: "#b23a48", marginBottom: 8 }}>Something crashed while rendering.</p>
            <p style={{ fontSize: 13, color: "#33476b", whiteSpace: "pre-wrap" }}>{String(this.state.error?.message || this.state.error)}</p>
            <p style={{ fontSize: 12, color: "#6a7fa8", marginTop: 12 }}>
              Open the browser console (F12) for the full stack trace, or copy this message back to Claude.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
