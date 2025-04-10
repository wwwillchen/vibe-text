
import TextRewriter from "@/components/TextRewriter";

const Index = () => {
  return (
    // Added background classes here for pinstripes
    <div className="min-h-screen w-full bg-white bg-[repeating-linear-gradient(45deg,_theme(colors.slate.100)_0,_theme(colors.slate.100)_1px,_transparent_1px,_transparent_16px)] py-8">
      <TextRewriter />
    </div>
  );
};

export default Index;
