"use client";

import { useState, useEffect } from "react";
import AssetUploader from "../../components/AssetUploader";
import AssetGallery from "../../components/AssetGallery";
import { AssetType, AssetCategory } from "@prisma/client";

interface StellarAppContentProps {
  profileId: string;
}

const StellarAppContent: React.FC<StellarAppContentProps> = ({ profileId }) => {
  const [activeType, setActiveType] = useState<AssetType>(AssetType.IMAGE);
  const [activeCategory, setActiveCategory] = useState<AssetCategory>(
    AssetCategory.GENERAL_IMAGE
  );

  useEffect(() => {
    switch (activeType) {
      case AssetType.IMAGE:
        setActiveCategory(AssetCategory.GENERAL_IMAGE);
        break;
      case AssetType.VIDEO:
        setActiveCategory(AssetCategory.ANIMATION);
        break;
      case AssetType.FONT:
        setActiveCategory(AssetCategory.TTF);
        break;
    }
  }, [activeType]);

  const getCategoriesForType = (type: AssetType): AssetCategory[] => {
    switch (type) {
      case AssetType.IMAGE:
        return [
          AssetCategory.WALLPAPER,
          AssetCategory.ICON,
          AssetCategory.LOGO,
          AssetCategory.GENERAL_IMAGE,
        ];
      case AssetType.VIDEO:
        return [AssetCategory.ANIMATION];
      case AssetType.FONT:
        return [
          AssetCategory.TTF,
          AssetCategory.OTF,
          AssetCategory.WOFF,
          AssetCategory.WOFF2,
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stellar Asset Manager</h1>
      <div className="mb-4">
        <select
          onChange={(e) => setActiveType(e.target.value as AssetType)}
          value={activeType}
          className="mr-2"
        >
          {Object.values(AssetType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setActiveCategory(e.target.value as AssetCategory)}
          value={activeCategory}
        >
          {getCategoriesForType(activeType).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <AssetUploader
        assetType={activeType}
        onUploadComplete={() => {
          // Refresh gallery
        }}
      />
      <AssetGallery 
        assetType={activeType} 
        category={activeCategory} 
        profileId={profileId}
      />
    </div>
  );
};

export default StellarAppContent;