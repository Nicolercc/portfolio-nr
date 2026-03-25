export function GlobalCanvas() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Base dark canvas */}
      <div className="absolute inset-0 bg-[#0D0D0D]" />

      {/* Atmospheric glows */}
      <div
        className="absolute -top-1/3 -left-1/3 h-[820px] w-[820px] rounded-full blur-[140px] opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle, rgba(212,132,154,1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/3 h-[860px] w-[860px] rounded-full blur-[150px] opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,1) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid overlay (faded to edges) */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(245,240,232,0.9) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 75% 70% at 50% 45%, black 35%, transparent 100%)",
        }}
      />
    </div>
  );
}

