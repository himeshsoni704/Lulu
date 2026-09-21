import { useRef } from "react";

const CLIENTS = [
  { name: "Mercedes-Benz",   logo: "/logos/mercedes-benz.png"  },
  { name: "SAFCO",           logo: "/logos/safco.png"           },
  { name: "Danube",          logo: "/logos/danube.png"          },
  { name: "Mitsubishi",      logo: "/logos/mitsubishi.png"      },
  { name: "Al Ghurair",      logo: "/logos/al-ghurair.png"      },
  { name: "Al Gurg FOSROC",  logo: "/logos/fosroc.png"          },
  { name: "K-Flex Gulf",     logo: "/logos/k-flex.png"          },
  { name: "General Motors",  logo: "/logos/general-motors.png"  },
];

// Triple the list for a seamless infinite loop
const TRACK = [...CLIENTS, ...CLIENTS, ...CLIENTS];

export default function ClientLogoMarquee() {
  const trackRef = useRef(null);

  return (
    <div
      className="relative overflow-hidden py-8 border-y border-line bg-bone select-none"
      aria-label="Our clients"
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-bone to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-bone to-transparent" />

      <div className="logo-marquee-wrapper overflow-hidden">
        <div
          ref={trackRef}
          className="logo-marquee-track flex items-center"
          style={{ width: "max-content", gap: "140px" }}
        >
          {TRACK.map((client, i) => (
            <div
              key={i}
              className="flex items-center justify-center flex-shrink-0"
              style={{ height: "64px" }}
              title={client.name}
            >
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                style={{
                  height: "56px",
                  width: "auto",
                  maxWidth: "200px",
                  objectFit: "contain",
                  display: "block",
                  filter: "grayscale(20%)",
                  opacity: 0.9,
                  transition: "opacity 0.2s, filter 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "grayscale(0%)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.filter = "grayscale(20%)"; }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
