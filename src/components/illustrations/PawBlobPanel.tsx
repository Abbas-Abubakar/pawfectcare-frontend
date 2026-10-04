interface PawBlobPanelProps {
  title: string;
  subtitle: string;
}

export const PawBlobPanel = ({ title, subtitle }: PawBlobPanelProps) => {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-coral p-12 lg:flex lg:w-[45%]">
      {/* Organic blob shapes */}
      <svg
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 opacity-30"
        viewBox="0 0 200 200"
      >
        <path
          fill="#FFC93C"
          d="M45.3,-58.3C58.8,-50.1,70.2,-36.7,74.6,-21.3C79,-5.9,76.4,11.5,69.1,26.4C61.8,41.3,49.8,53.7,35.6,61.5C21.4,69.3,5,72.5,-11.9,71.4C-28.8,70.3,-46.2,64.9,-58.4,53.5C-70.6,42.1,-77.6,24.7,-78.5,6.9C-79.4,-10.9,-74.2,-29.1,-63.5,-43.1C-52.8,-57.1,-36.6,-66.9,-20.1,-73.8C-3.6,-80.7,13.2,-84.7,27.9,-78.8C42.6,-72.9,45.3,-58.3,45.3,-58.3Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 opacity-20"
        viewBox="0 0 200 200"
      >
        <path
          fill="#FFFFFF"
          d="M39.5,-49.5C50.4,-41.2,58,-27.9,61.6,-13.1C65.2,1.7,64.8,18,58.1,31.4C51.4,44.8,38.4,55.3,23.7,61.2C9,67.1,-7.4,68.4,-22.4,64C-37.4,59.6,-51,49.5,-59.4,35.9C-67.8,22.3,-71,5.2,-67.8,-10.5C-64.6,-26.2,-55,-40.5,-42.3,-48.9C-29.6,-57.3,-14.8,-59.8,0.5,-60.4C15.8,-61,31.6,-59.7,39.5,-49.5Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Paw print scatter */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        {[...Array(8)].map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 64 64"
            className="absolute h-10 w-10"
            style={{
              top: `${(i * 37) % 90}%`,
              left: `${(i * 53) % 90}%`,
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            <circle cx="32" cy="40" r="14" fill="white" />
            <circle cx="14" cy="22" r="7" fill="white" />
            <circle cx="32" cy="12" r="7.5" fill="white" />
            <circle cx="50" cy="22" r="7" fill="white" />
          </svg>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white">
          <svg viewBox="0 0 64 64" className="h-9 w-9">
            <circle cx="32" cy="40" r="14" fill="white" />
            <circle cx="14" cy="22" r="7" fill="white" />
            <circle cx="32" cy="12" r="7.5" fill="white" />
            <circle cx="50" cy="22" r="7" fill="white" />
          </svg>
          <span className="font-display text-2xl font-bold">PawfectCare</span>
        </div>
      </div>

      <div className="relative z-10 max-w-sm">
        <h2 className="font-display text-4xl font-bold leading-tight text-white">{title}</h2>
        <p className="mt-4 text-lg text-white/90">{subtitle}</p>
      </div>

      <div className="relative z-10" />
    </div>
  );
};