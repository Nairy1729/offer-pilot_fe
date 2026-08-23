import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function GreetingMonkey() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        setShouldRender(false);
      },
      prefersReducedMotion ? 3200 : 8200
    );

    return () => window.clearTimeout(timeoutId);
  }, [prefersReducedMotion]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
  className="pointer-events-none fixed right-10 top-0 z-50 sm:right-20 lg:right-32"
  aria-hidden="true"
>
      <div
        className={
          prefersReducedMotion
            ? "animate-[monkeyReduced_3s_ease-in-out_forwards]"
            : "animate-[monkeyDropLong_8s_cubic-bezier(0.22,1,0.36,1)_forwards]"
        }
      >
        <div
          className={
            prefersReducedMotion
              ? ""
              : "origin-top animate-[monkeySwingLong_4.8s_ease-in-out_1.4s_1]"
          }
        >
          <svg
            width="130"
            height="320"
            viewBox="0 0 130 320"
            className="h-[260px] w-[105px] sm:h-[320px] sm:w-[130px]"
          >
            <line
              x1="65"
              y1="0"
              x2="65"
              y2="165"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M62 160 C62 172, 68 172, 68 160"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <g transform="translate(65 198) scale(0.82)">
              <ellipse
                cx="0"
                cy="35"
                rx="35"
                ry="42"
                fill="#8b5e3c"
                stroke="#4b2f22"
                strokeWidth="2"
              />

              <circle
                cx="0"
                cy="-10"
                r="34"
                fill="#8b5e3c"
                stroke="#4b2f22"
                strokeWidth="2"
              />

              <circle cx="-27" cy="-16" r="13" fill="#8b5e3c" />
              <circle cx="27" cy="-16" r="13" fill="#8b5e3c" />

              <ellipse cx="0" cy="-5" rx="23" ry="20" fill="#f3c49b" />

              <circle cx="-9" cy="-12" r="3" fill="#1f2937" />
              <circle cx="9" cy="-12" r="3" fill="#1f2937" />

              <ellipse cx="0" cy="-2" rx="5" ry="3.5" fill="#4b2f22" />

              <path
                d="M-9 7 C-4 13, 4 13, 9 7"
                fill="none"
                stroke="#4b2f22"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M-28 23 C-48 32, -50 54, -35 63"
                fill="none"
                stroke="#8b5e3c"
                strokeWidth="10"
                strokeLinecap="round"
              />

              <g
                className={
                  prefersReducedMotion
                    ? ""
                    : "origin-[28px_22px] animate-[monkeyWave_0.45s_ease-in-out_3s_4]"
                }
              >
                <path
                  d="M28 23 C47 18, 56 4, 51 -13"
                  fill="none"
                  stroke="#8b5e3c"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                <circle cx="51" cy="-15" r="7" fill="#f3c49b" />
              </g>

              <path
                d="M-15 73 C-20 90, -8 99, 2 86"
                fill="none"
                stroke="#8b5e3c"
                strokeWidth="10"
                strokeLinecap="round"
              />

              <path
                d="M15 73 C20 90, 8 99, -2 86"
                fill="none"
                stroke="#8b5e3c"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </g>

            <g
              className={
                prefersReducedMotion
                  ? "opacity-100"
                  : "animate-[greetingBubbleLong_8s_ease-in-out_forwards]"
              }
            >
              <rect
                x="2"
                y="245"
                width="68"
                height="32"
                rx="16"
                fill="#0f172a"
                stroke="#334155"
              />
              <text
                x="36"
                y="266"
                textAnchor="middle"
                className="fill-white text-[12px] font-semibold"
              >
                Hey!
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}