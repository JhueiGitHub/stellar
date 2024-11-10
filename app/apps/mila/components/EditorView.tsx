import { useEffect } from "react";
import { ShootingStars } from "./ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";
import { FileTree, Folder, File } from "./ui/file-tree";
import FlowCanvasContents from "./FlowCanvasContents";

interface EditorViewProps {
  flowId: string;
  onClose: () => void;
}

export const EditorView = ({ flowId, onClose }: EditorViewProps) => {
  // Prevent scrolling when editor is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#010203] flex">
      {/* Left Sidebar */}
      <div className="w-[264px] h-full border-r border-white/[0.09] flex flex-col bg-[#010203]/80">
        <div className="h-[57px] border-b border-white/[0.09] p-4 flex flex-col justify-center">
          <span className="text-[#cccccc]/80 text-[13px] font-bold">
            Zenith
          </span>
          <span className="text-[#cccccc]/70 text-[11px] font-medium">OS</span>
        </div>

        <div className="h-10 border-b border-white/[0.09] flex px-2 gap-2 items-center">
          <button className="px-[9px] py-2 bg-[#292929]/50 rounded-md">
            <span className="text-[#cccccc]/80 text-[11px] font-semibold">
              File
            </span>
          </button>
          <button className="px-[9px] py-2">
            <span className="text-[#cccccc]/50 text-[11px] font-semibold">
              Assets
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <FileTree>
            <Folder name="Pages" defaultExpanded>
              <File name="main" active />
              <File name="zenith" />
              <File name="latte" />
              <File name="design-system 2" />
            </Folder>
            <Folder name="Typography">
              <File name="font-styles" />
              <File name="weights" />
            </Folder>
          </FileTree>
        </div>
      </div>
      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ShootingStars />
        <StarsBackground />
        <FlowCanvasContents />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          ESC
        </button>
      </div>
      {/* Right Sidebar */}
      <div className="w-[264px] border-l border-white/[0.09] flex flex-col bg-[#010203]/80">
        <div className="h-10 px-4 flex items-center gap-8">
          <span className="text-[#cccccc]/80 text-[11px] font-semibold">
            Design
          </span>
          <span className="text-[#cccccc]/30 text-[11px]">Prototype</span>
          <span className="text-[#cccccc]/30 text-[11px]">Code</span>
        </div>

        <div className="flex-1 bg-black/30 p-4">
          <div className="space-y-4">
            <div className="text-[#cccccc]/70 text-sm">Properties</div>
            {/* Add property controls here */}
          </div>
        </div>
      </div>
    </div>
  );
};
