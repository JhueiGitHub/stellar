// app/apps/flow/components/FlowCanvasContents.tsx
"use client";

import React from "react";
import { ShootingStars } from "./ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";
import { Live } from "./Live";
import { useFlowStore } from "@/app/store/flowStore";

interface FlowCanvasContentsProps {
  flowId: string;
}

const FlowCanvasContents = ({ flowId }: FlowCanvasContentsProps) => {
  const { flows } = useFlowStore();
  const currentFlow = flows.find((flow) => flow.id === flowId);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#010203]">
      <div className="fixed inset-0 w-full h-full">
        <ShootingStars className="absolute inset-0 w-full h-full" />
        <StarsBackground className="absolute inset-0 w-full h-full" />
      </div>

      <Live />

      <div className="fixed inset-0 pointer-events-none">
        <div className="h-full w-full p-24 overflow-auto">
          <div className="grid grid-cols-3 gap-8 max-w-[1200px] mx-auto">
            {currentFlow?.designSystem?.colorTokens.map((token) => (
              <div
                key={token.id}
                className="bg-[#010203]/70 rounded-xl border border-white/[0.09] p-6 space-y-6 pointer-events-auto"
              >
                <div
                  className="w-full aspect-[1.4] rounded-lg border border-white/[0.09]"
                  style={{
                    backgroundColor: token.value,
                    opacity: token.opacity / 100,
                  }}
                />
                <div className="space-y-2.5">
                  <h3 className="text-[#cccccc] text-sm font-semibold font-['Inter']">
                    {token.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-[#cccccc]/70">{token.value}</span>
                    <span className="text-[#cccccc]/70 text-[6px]">•</span>
                    <span className="text-[#cccccc]/70">
                      Opacity: {token.opacity}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowCanvasContents;
