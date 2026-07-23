import type { ReactNode } from "react";
import "./Layout.css";

function Layout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="app-frame">
      <div className="layout">
        <div className="layout-left">{left}</div>
        <div className="layout-right">{right}</div>
      </div>
    </div>
  );
}

export default Layout;
