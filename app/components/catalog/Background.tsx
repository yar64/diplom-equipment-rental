// app/catalog/components/Background.tsx
export default function Background() {
  return (
    <div className="fixed inset-0 z-[-2] grid-background">
      <div className="grid-pattern" />
      <div className="floating-dots">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="dot" />
        ))}
      </div>
    </div>
  );
}