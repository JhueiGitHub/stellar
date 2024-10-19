import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div
      className="flex items-center justify-center h-screen w-screen"
      style={{ backgroundColor: "#111111" }}
    >
      <Image
        src="/media/loading.gif"
        alt="Loading..."
        width={360}
        height={360}
        priority
      />
    </div>
  );
};

export default LoadingScreen;
