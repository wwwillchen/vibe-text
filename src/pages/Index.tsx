
import TextRewriter from "@/components/TextRewriter";

export default function Index() {
  return (
    <div 
      className="min-h-screen w-full p-4"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px)',
        backgroundSize: '20px 100%'
      }}
    >
      <TextRewriter />
    </div>
  );
}
