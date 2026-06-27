export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-6 z-20 md:left-10">
      <svg
        viewBox="0 0 100 100"
        className="h-20 w-20 animate-[spin_14s_linear_infinite]"
        aria-hidden
      >
        <defs>
          <path
            id="scroll-circle"
            d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
          />
        </defs>
        <text
          className="fill-paper-white"
          style={{ fontSize: "9px", letterSpacing: "2px" }}
        >
          <textPath href="#scroll-circle" startOffset="0%">
            SCROLL TO EXPLORE · SCROLL TO EXPLORE ·
          </textPath>
        </text>
      </svg>
    </div>
  );
}
