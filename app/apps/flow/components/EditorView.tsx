// app/apps/flow/components/EditorView.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileTree, Folder, File } from "./ui/file-tree";
import FlowCanvasContents from "./FlowCanvasContents";

interface EditorViewProps {
  flowId: string;
  onClose: () => void;
}

export const EditorView = ({ flowId, onClose }: EditorViewProps) => {
  const [areSidebarsVisible, setAreSidebarsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "§") {
        setAreSidebarsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const slideAnimation = {
    initial: (direction: "left" | "right") => ({
      x: direction === "left" ? -264 : 264,
    }),
    animate: { x: 0 },
    exit: (direction: "left" | "right") => ({
      x: direction === "left" ? -264 : 264,
    }),
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#010203]">
      <div className="w-full h-full relative">
        <div className="absolute inset-0 px-[280px]">
          <FlowCanvasContents flowId={flowId} />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          ESC
        </button>

        <AnimatePresence>
          {areSidebarsVisible && (
            <motion.div
              custom="left"
              variants={slideAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute left-0 top-0 bottom-0 w-[264px] border-r border-white/[0.09] flex flex-col bg-[#010203]/80 backdrop-blur-sm z-10"
            >
              <FileTree>
                <Folder name="Pages" defaultExpanded>
                  <File name="main" active />
                  <File name="zenith" />
                </Folder>
              </FileTree>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {areSidebarsVisible && (
            <motion.div
              custom="right"
              variants={slideAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute right-0 top-0 bottom-0 w-[264px] border-l border-white/[0.09] flex flex-col bg-[#010203]/80 backdrop-blur-sm z-10"
            >
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
