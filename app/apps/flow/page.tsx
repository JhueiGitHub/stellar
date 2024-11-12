// app/apps/flow/pages.tsx
"use client";

import dynamic from "next/dynamic";
import Room from "./Room";

const App = dynamic(() => import("./App"), { ssr: false });

export default function FlowPage() {
  return (
    <Room>
      <App />
    </Room>
  );
}
