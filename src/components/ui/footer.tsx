export function Footer(){
    return(
    <footer className="w-full py-14 bg-[#1a1b26] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 2px, transparent 2px)',
          backgroundSize: '4rem 100%', 
        }}
      />

      {/* content */}
      <div className="relative z-5 container mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
        
        <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
          vocuz.
        </h2>

        {/* Subtitle / Tagline */}
        <p className="text-lg md:text-xl text-gray-300 mb-12 font-medium max-w-md leading-relaxed">
          You're fucking lovely productivity app.
        </p>

        {/* Credits */}
        <div className="text-sm text-gray-400 flex items-center gap-1.5">
          <span>Made with</span>
          <span role="img" aria-label="love" className="text-red-500 text-base animate-pulse">
            ❤️
          </span>
          <span className="font-semibold text-gray-300">ZenSabbath</span>
        </div>

      </div>
    </footer>
  );
}