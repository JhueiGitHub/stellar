// app/apps/flow/components/FlowSidebar.tsx
export const FlowSidebar = () => {
  return (
    <div className="w-[264px] h-full flex flex-col border-r border-white/[0.09]">
      <div className="h-[56px] flex items-center px-2 border-b border-white/[0.09]">
        <div className="w-full h-[32px] bg-[#292929]/50 rounded-md pl-[11px] flex items-center gap-[13px]">
          <img src="/icns/_search.png" alt="Search" className="w-3 h-3" />
          <span className="text-[11px] text-[#4c4f69]/70">
            Search for anything...
          </span>
        </div>
      </div>

      <div className="h-[152px] py-3 border-b border-white/[0.09]">
        <div className="h-8 pl-[15px] flex items-center gap-[13px]">
          <img src="/icns/_avatar.png" alt="Avatar" className="w-4 h-4" />
          <span className="text-[13px] font-semibold text-[#cccccc]/80">
            Flows
          </span>
        </div>
      </div>
    </div>
  );
};
