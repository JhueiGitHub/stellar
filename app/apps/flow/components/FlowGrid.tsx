// app/apps/flow/components/FlowGrid.tsx
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFlowStore } from "@/app/store/flowStore";

interface FlowGridProps {
  onStreamSelect: (streamId: string) => void;
}

export const FlowGrid = ({ onStreamSelect }: FlowGridProps) => {
  const { flows } = useFlowStore();

  return (
    <div className="flex-1 min-w-0 px-[33px] py-5">
      <div className="flex flex-wrap gap-8">
        {flows.map((flow) => (
          <Card
            key={flow.id}
            onClick={() => onStreamSelect(flow.id)}
            className="w-[291px] h-[247px] flex-shrink-0 border border-white/[0.09] rounded-[15px] bg-transparent transition-all hover:border-white/20 cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[115px] h-16 rounded-[9px] border border-white/[0.09]"
                  />
                ))}
              </div>

              <div className="pl-px space-y-2.5">
                <h3 className="text-sm font-semibold text-[#cccccc]">
                  {flow.name}
                </h3>
                <div className="flex items-center gap-[3px] text-[11px] text-[#cccccc]/70">
                  <span>{flow.description || "Design System"}</span>
                  <span className="text-[6px]">•</span>
                  <span>
                    Updated {new Date(flow.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
