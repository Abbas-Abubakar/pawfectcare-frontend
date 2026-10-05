import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'lg';
}

const STAR_PATH =
  'M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z';

export const StarRating = ({ value, onChange, readOnly = false, size = 'lg' }: StarRatingProps) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  const displayedValue = hoveredStar || value;

  const sizeClass = size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';

  const handleChange = (star: number) => {
    if (!readOnly) {
      onChange?.(star);
    }
  };

  return (
    <div
      className="flex items-center gap-2"
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} out of 5 stars`}
      onMouseLeave={() => !readOnly && setHoveredStar(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayedValue;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            role={readOnly ? undefined : 'radio'}
            aria-checked={readOnly ? undefined : star === value}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => handleChange(star)}
            onMouseEnter={() => !readOnly && setHoveredStar(star)}
            className={`
              group relative
              ${sizeClass}
              shrink-0
              rounded-full
              transition-all
              duration-300
              ease-out
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-amber-400
              focus-visible:ring-offset-2
              ${readOnly
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-125'
              }
            `}
          >
            {/* Top particle */}
            {!readOnly && (
              <span
                className="
                  pointer-events-none
                  absolute
                  -top-2
                  left-1/2
                  h-1.5
                  w-1.5
                  -translate-x-1/2
                  rounded-full
                  bg-amber-400
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:-translate-y-1
                  group-hover:scale-125
                  group-hover:opacity-100
                "
              />
            )}

            {/* Bottom particle */}
            {!readOnly && (
              <span
                className="
                  pointer-events-none
                  absolute
                  -bottom-2
                  left-1/2
                  h-1.5
                  w-1.5
                  -translate-x-1/2
                  rounded-full
                  bg-amber-400
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:translate-y-1
                  group-hover:scale-125
                  group-hover:opacity-100
                "
              />
            )}

            {/* Left particle */}
            {!readOnly && (
              <span
                className="
                  pointer-events-none
                  absolute
                  left-0
                  top-1/2
                  h-1
                  w-1
                  -translate-y-1/2
                  rounded-full
                  bg-amber-300
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:-translate-x-1
                  group-hover:opacity-100
                "
              />
            )}

            {/* Right particle */}
            {!readOnly && (
              <span
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-1/2
                  h-1
                  w-1
                  -translate-y-1/2
                  rounded-full
                  bg-amber-300
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:opacity-100
                "
              />
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              className={`
                relative
                h-full
                w-full
                transition-all
                duration-300
                ${isFilled
                  ? `
                      fill-amber-400
                      drop-shadow-[0_0_7px_rgba(245,158,11,0.55)]
                    `
                  : 'fill-gray-300'
                }
                ${!readOnly
                  ? `
                      group-hover:fill-amber-400
                      group-hover:drop-shadow-[0_0_14px_rgba(245,158,11,0.9)]
                    `
                  : ''
                }
              `}
              aria-hidden="true"
            >
              <path d={STAR_PATH} />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

