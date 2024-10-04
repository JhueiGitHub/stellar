import React from "react";
import { useFinderStore } from "@os/hooks/useFinderStore";
import { useStyles } from "@os/hooks/useStyles";
import { Card, CardContent } from "@fc/ui/card";

interface ContentAreaProps {
  onItemSelect: () => void;
}

const ContentArea: React.FC<ContentAreaProps> = ({ onItemSelect }) => {
  const { getColor, getFont } = useStyles();
  const { contentItems, selectItem } = useFinderStore();

  const handleItemClick = (itemId: string) => {
    selectItem(itemId);
    onItemSelect();
  };

  return (
    <div
      className="flex-grow p-4 overflow-y-auto"
      style={{
        backgroundColor: getColor("Underlying BG"),
        color: getColor("Text Primary (Hd)"),
        fontFamily: getFont("Text Primary"),
      }}
    >
      <div className="grid grid-cols-4 gap-4">
        {contentItems.map((item) => (
          <Card key={item.id} onClick={() => handleItemClick(item.id)}>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <img
                src={
                  item.type === "folder"
                    ? "/icns/_folder.svg"
                    : "/icns/_file.svg"
                }
                alt={item.type}
                className="w-12 h-12 mb-2"
              />
              <p>{item.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentArea;
