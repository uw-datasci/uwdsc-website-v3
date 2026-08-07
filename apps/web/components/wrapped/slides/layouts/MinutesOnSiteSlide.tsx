import { cn } from "@uwdsc/ui/lib/utils";
import { tiltWarp, atkinsonHyperlegibleMono, displayFontClass as display, monoFontClass as mono } from "../../fonts";
import type { MinutesOnSiteSlideData } from "../../types";

interface MinutesOnSiteSlideProps {
  readonly slide: MinutesOnSiteSlideData;
}

/**
 * "Minutes on the site" slide: a big centered stat number ringed by
 * decorative blob shapes, with two smaller critter accents in the corners.
 * Matches the Spotify Wrapped "My Minutes Listened" reference layout.
 *
 * Data injection points (see {@link MinutesOnSiteSlideData}):
 * - `slide.eyebrow`: small label above the heading, e.g. "Locked in".
 * - `slide.heading`: headline above the stat, e.g. "MINUTES ON THE SITE".
 * - `slide.stat`: the big hero number.
 * - `slide.captionLines`: supporting mono text below the stat, one line per entry.
 *
 * Not driven by data, edit directly in this file:
 * - Background color: the `bg-[#ff8f64]` class on the outer div.
 * - Center blob shapes and colors: `MushroomBlob`, `FlowerBlob`, `LeafBlob`
 *   below, each a hardcoded multi-color SVG. Change their `fill` values or
 *   swap in a different shape.
 * - Corner accents: `CritterAccentSvg`, positioned via the `cornerAccents` array.
 */
export function MinutesOnSiteSlide({ slide }: MinutesOnSiteSlideProps) {
  const cornerAccents: {
    readonly left?: string;
    readonly right?: string;
    readonly top?: string;
    readonly bottom?: string;
    readonly width: string;
    readonly rotate: string;
  }[] = [
    { left: "6%", top: "10%", width: "3.6rem", rotate: "-12deg" },
    { right: "8%", bottom: "12%", width: "3.2rem", rotate: "16deg" },
  ];

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-[#ff8f64] px-4 py-5 text-black sm:px-8 sm:py-6",
        tiltWarp.variable,
        atkinsonHyperlegibleMono.variable,
      )}
    >
      {cornerAccents.map((accent, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="pointer-events-none absolute select-none"
          style={{
            left: accent.left,
            right: accent.right,
            top: accent.top,
            bottom: accent.bottom,
            width: accent.width,
            transform: `rotate(${accent.rotate})`,
          }}
        >
          <CritterAccentSvg />
        </div>
      ))}

      <div className="relative z-10 flex h-full min-h-0 w-full max-w-104 flex-col items-center justify-center gap-4 pt-6 pb-2 sm:max-w-96 sm:gap-6 sm:pt-10 sm:pb-2">
        <div className="text-center">
          <p className={cn(display, "text-[1.1rem] leading-none tracking-tight text-black sm:text-[1.3rem]")}>
            {slide.eyebrow}
          </p>
          <h2 className={cn(display, "mt-1 text-[1.7rem] leading-none tracking-tight text-white sm:mt-1 sm:text-[1.9rem]")}>
            {slide.heading}
          </h2>
        </div>

        <div className="relative flex size-72 items-center justify-center sm:size-64">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-8%] left-[-10%] size-28 opacity-90 sm:size-24">
              <div className="size-full -rotate-18">
                <MushroomBlob />
              </div>
            </div>
            <div className="absolute top-[-10%] left-[36%] size-20 opacity-90 sm:size-16">
              <div className="size-full rotate-40">
                <LeafBlob />
              </div>
            </div>
            <div className="absolute top-[-6%] right-[-12%] size-24 opacity-90 sm:size-20">
              <div className="size-full rotate-24">
                <FlowerBlob />
              </div>
            </div>
            <div className="absolute top-[36%] left-[-16%] size-20 opacity-90 sm:size-16">
              <div className="size-full rotate-160">
                <FlowerBlob />
              </div>
            </div>
            <div className="absolute top-[36%] right-[-16%] size-20 opacity-90 sm:size-16">
              <div className="size-full -rotate-120">
                <MushroomBlob />
              </div>
            </div>
            <div className="absolute bottom-[-10%] left-[36%] size-28 opacity-90 sm:size-24">
              <div className="size-full rotate-8">
                <LeafBlob />
              </div>
            </div>
          </div>

          <p
            className={cn(
              display,
              "relative z-10 text-[3.4rem] leading-none tracking-tight text-white sm:text-[4.2rem]",
            )}
          >
            {slide.stat}
          </p>
        </div>

        <div className={cn(mono, "flex flex-col items-center gap-0.5 text-center text-[1.05rem] leading-snug text-black sm:text-[1rem]")}>
          {slide.captionLines.map((line) => (
            <p key={line} className="whitespace-nowrap">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function MushroomBlob() {
  return (
    <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" viewBox="0 0 190.959 220.98" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M73.6073 0.640992C81.6131 -0.0317372 91.2863 0.509768 98.7949 0.271852C116.674 -1.99246 137.254 10.2069 147.456 24.9906C158.074 40.3813 172.781 42.3093 183.482 53.5077C188.541 58.8814 191.227 66.068 190.938 73.4352C190.515 83.641 183.717 94.5524 176.298 101.181C155.572 119.698 129.076 118.467 103.648 117.45C106.987 133.636 109.367 146.443 110.614 162.785C125.182 143.301 149.71 123.25 173.51 117.573C175.09 117.991 176.646 118.492 178.173 119.074C194.228 125.186 190.606 158.445 185.348 171.03C176.716 191.696 163.631 206.513 142.892 215.414C123.75 221.305 113.044 223.323 93.5939 217.49C66.2752 225.546 45.1956 210.557 29.7797 189.046C27.5018 185.871 22.7185 178.709 21.6861 175.001C10.7639 135.81 70.1222 157.92 85.4125 166.452C83.5825 146.755 86.0148 136.869 80.2443 116.498C73.906 117.655 68.243 118.68 62.0548 120.518C50.12 123.734 36.6958 132.964 23.919 127.713C-3.32335 116.515 0.194568 99.4912 8.15851 77.7177C6.10537 75.4534 3.6608 73.1317 1.478 70.9576L1.32044 70.1618C-0.456164 61.0964 -1.39986 52.2853 4.94258 44.5818C20.9394 25.1464 49.1057 5.21063 73.6073 0.640992Z" fill="#2dd4bf" />
      <path d="M79.2147 23.6693C80.5014 23.6119 89.1046 25.4085 91.6616 25.7284C98.9222 26.6391 105.546 27.0657 112.848 27.5252C127.625 38.4939 129.943 44.9669 142.603 56.7807C147.906 61.7277 158.949 65.6574 166.19 72.4257C151.279 98.1453 124.427 91.7955 98.155 91.3525C86.7388 90.9505 79.1753 90.7453 67.0525 92.4107C54.9142 94.0843 43.2255 102.493 31.8593 102.444C31.0707 102.436 29.6774 101.509 29.107 100.426C27.5011 97.366 30.8246 88.0708 31.879 84.6087C35.2468 73.5579 30.9074 67.733 25.6367 58.3805C30.402 51.7188 37.5059 46.5256 43.763 41.3325C55.7397 31.3892 63.8538 26.1141 79.2147 23.6693Z" fill="#e6c6e0" />
      <path d="M91.7596 37.2852C103.227 36.0875 109.174 44.8985 103.869 54.9731C98.8783 64.4569 83.5831 67.3775 73.8262 69.9454C57.3132 72.062 52.9549 45.4892 80.9695 45.522C85.4968 41.3051 86.3354 40.3371 91.7596 37.2852Z" fill="#9cd8ea" />
      <path d="M162.857 147.977L163.82 148.469C165.709 156.41 158.233 169.906 153.458 176.067C144.896 187.118 134.714 193.205 120.893 195.084C119.512 194.657 120.172 194.961 119.074 193.689C125.503 174.156 146.499 158.986 162.857 147.977Z" fill="#ffca82" />
      <path d="M55.0234 179.939C61.4701 180.399 82.4611 187.897 85.3972 193.853C70.6543 196.044 64.3307 190.391 55.0234 179.939Z" fill="#ff8fab" />
    </svg>
  );
}

function FlowerBlob() {
  return (
    <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" viewBox="0 0 220.466 250.807" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M180.68 69.4057C184.88 88.1973 177.6 94.0817 163.234 103.367C167.91 107.031 173.564 111.224 177.773 115.274C183.627 120.915 189.062 135.856 184.933 143.358C171.429 167.891 141.819 197.44 111.288 185.548C107.703 198.132 96.7437 244.408 78.2353 245.144C68.7782 245.52 66.669 236.41 67.3892 227.951C80.6134 211.66 84.05 191.697 91.3579 173.038C87.2874 175.238 82.4091 177.081 78.0875 178.839C65.7914 181.297 53.6611 178.007 45.1437 168.561C28.9888 150.642 15.6268 125.822 36.3042 105.84C21.8777 98.3976 11.5213 84.4933 16.2871 68.1373C19.3788 56.8303 28.0332 45.2911 38.6309 39.7698C65.7925 25.6202 81.3328 18.1838 98.4942 49.0745C115.9 36.1089 133.644 31.5094 154.963 39.2761C168.697 44.2759 175.205 56.6079 180.68 69.4057Z" fill="#ff7075" />
      <path d="M156.016 75.206C157.874 82.0307 133.471 88.3567 129.19 93.9389C126.651 97.2595 121.103 100.678 121.448 106.445C122.186 118.972 137.019 117.102 145.305 120.33C151.801 123.064 158.442 129.856 162.932 134.796C149.688 149.061 144.261 156.371 126.04 163.862C123.524 155.716 121.041 145.692 115.589 139.619C100.499 122.808 81.9061 155.211 68.1984 154.763C64.0845 154.629 53.9325 140.347 50.9296 136.149C44.8476 121.622 59.8136 121.179 71.082 115.466C70.1099 86.7778 55.7574 94.0637 41.4283 76.4412C34.5556 67.9784 66.0471 52.9908 71.7664 50.4642C79.8561 64.3155 78.8527 77.119 87.6323 89.4048C88.6864 90.8773 93.4147 93.5962 95.311 92.9502C107.078 88.9423 106.476 75.2011 114.653 64.7918C132.404 58.6297 145.866 54.1923 156.016 75.206Z" fill="#9cd8ea" />
    </svg>
  );
}

function LeafBlob() {
  return (
    <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" viewBox="0 0 186.67 227.012" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M122.54 0.0494352C151.239 -1.48718 135.453 33.1969 132.58 48.5319C127.57 76.0892 127.022 104.272 130.959 132.003C134.357 129.927 141.352 125.349 145.013 125.011C163.698 123.846 172.878 142.949 177.84 157.096C200.651 222.128 177.714 210.35 126.889 216.315C107.256 218.618 74.4538 223.825 54.0291 226.995C52.3296 227.126 48.4801 226.495 47.5184 225.123C33.5632 205.201 25.088 181.225 15.8973 158.809C12.8537 151.384 -0.833144 124.339 0.0399763 118.589C5.34845 83.6287 48.8248 118.149 59.23 130.867C60.4125 119.096 63.9698 99.3492 67.1661 88.2262C73.6685 65.6012 102.477 10.7639 122.54 0.0494352Z" fill="#ccda96" />
      <path d="M102.301 70.373C103.374 75.6236 102.061 94.6462 102.227 101.323C102.6 116.313 103.513 130.427 105.84 145.266C108.589 162.789 103.203 183.766 129.015 176.26C135.428 167.936 140.855 159.735 147.918 151.837C154.128 166.097 157.253 172.21 159.692 187.642C144.32 188.487 106.618 194.253 91.4027 197.146C80.652 198.75 69.9743 200.817 59.4017 203.341C51.7217 182.597 44.1426 166.998 36.9902 144.747C47.5514 153.57 61.1701 173.158 75.7005 168.554C88.1187 164.618 83.5315 142.202 84.5975 131.865C86.786 110.636 92.0403 89.1996 102.301 70.373Z" fill="#ffca82" />
    </svg>
  );
}

function CritterAccentSvg() {
  return (
    <svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 169 244" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M69.0823 0.000185648C82.0831 -0.0613445 93.0045 15.1866 100.715 23.9288C112.852 37.6903 119.273 52.6987 119.774 71.0347C128.523 59.8789 143.443 59.4498 144.317 75.6478C144.733 83.353 129.82 93.6523 123.584 98.7257C138.257 108.619 152.657 118.064 161.027 134.352C182.045 175.255 157.486 225.602 115.483 240.588C87.5689 247.692 69.9948 239.391 45.0001 226.5C23.3953 215.356 8.57602 193.943 2.35749 170.325C-2.47093 151.912 0.180435 132.336 9.73307 115.87C20.3115 97.989 42.8271 86.5362 62.4018 81.5563C49.2853 56.6809 50.5088 34.9788 56.7503 8.81703C61.1922 4.31958 63.5711 2.78873 69.0823 0.000185648Z"
        fill="#9cd8ea"
      />
      <path
        d="M69.7475 105.129C76.0554 104.56 78.8521 104.73 85.2347 105.199C80.5794 111.852 78.1324 116.689 75.3842 124.268C72.1773 121.44 68.51 118.936 64.055 118.896C61.4725 118.849 58.9812 119.846 57.1439 121.661C46.0263 132.695 62.1938 144.924 72.7591 148.21C87.493 152.793 105.859 154.772 117.98 142.911C121.974 139.003 121.49 130.988 116.575 128.313C110.439 124.702 105.248 125.841 98.7139 126.993C100.605 123.861 102.629 119.472 105.861 118.572C110.842 120.047 128.805 133.326 132.785 138.142C141.566 148.766 143.181 154.339 142.338 167.536C139.875 190.531 130.621 209.084 106.913 216.592C89.5388 221.448 74.5874 212.562 59.2191 205.355C31.7167 192.46 17.9839 155.507 31.6822 128.283C38.0575 115.612 56.0319 108.528 69.7475 105.129Z"
        fill="#ff7075"
      />
      <path
        d="M76.2628 35.6816C78.3693 37.0607 80.2837 39.5096 82.0645 41.3326C95.0735 54.6518 93.74 65.5935 93.0942 82.8564C80.5792 77.8224 76.0864 47.5373 76.2628 35.6816Z"
        fill="#ff7075"
      />
    </svg>
  );
}
