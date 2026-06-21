"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { PassportQRCode } from "./PassportQRCode";

interface PassportCardProps {
  readonly userId: string;
  readonly initials: string;
  readonly displayName: string;
  readonly email: string | null | undefined;
  readonly facultyLabel?: string;
  readonly term?: string;
  readonly isMember: boolean;
  readonly membershipLoading: boolean;
  readonly execPositionLabel?: string | null;
}

const CARD_BG = {
  background:
    "linear-gradient(160deg, oklch(0.17 0.07 292) 0%, oklch(0.13 0.04 285) 100%)",
};

const W = 260;
const H = W * 1.5; // 390 — never changes

function buildMrz(displayName: string, term?: string): [string, string] {
  const cleaned = displayName.toUpperCase().replace(/[^A-Z ]/g, "");
  const parts = cleaned.split(" ");
  const surname = (parts[parts.length - 1] ?? "MEMBER").slice(0, 9).padEnd(9, "<");
  const given = (parts.slice(0, -1).join("<") || "MEMBER").slice(0, 9).padEnd(9, "<");
  const termStr = (term ?? "")
    .replace(/[^A-Z0-9]/gi, "")
    .slice(0, 4)
    .padEnd(4, "<")
    .toUpperCase();
  const line1 = `P<UWDSC${surname}<<${given}`.slice(0, 44).padEnd(44, "<");
  const line2 = `MEMBER01<UWDSC${termStr}<<<<<<<<<<<<<<<<<<<<<<`
    .slice(0, 44)
    .padEnd(44, "<");
  return [line1, line2];
}

function MemberBadge({
  isMember,
  membershipLoading,
}: {
  isMember: boolean;
  membershipLoading: boolean;
}) {
  if (membershipLoading)
    return (
      <span
        className="h-3 w-16 rounded-sm inline-block"
        style={{ background: "rgba(255,255,255,0.1)" }}
      />
    );
  if (isMember)
    return (
      <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-400/15 text-emerald-300 border border-emerald-400/25 tracking-widest uppercase">
        Active
      </span>
    );
  return (
    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-sm bg-red-400/15 text-red-400 border border-red-400/25 tracking-widest uppercase">
      Not Paid
    </span>
  );
}

function BioPage({
  userId,
  initials,
  displayName,
  email,
  facultyLabel,
  term,
  isMember,
  membershipLoading,
  execPositionLabel,
}: PassportCardProps) {
  const [mrzLine1, mrzLine2] = buildMrz(displayName, term);
  const nameParts = displayName.toUpperCase().split(" ");
  const surname = nameParts[nameParts.length - 1] ?? displayName.toUpperCase();
  const givenNames = nameParts.slice(0, -1).join(" ") || displayName.toUpperCase();
  const [qrExpanded, setQrExpanded] = useState(false);

  return (
    <div
      className="relative w-full h-full flex flex-col select-none overflow-hidden"
      style={CARD_BG}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/logos/dsc.svg')",
          backgroundSize: "44px 44px",
          backgroundRepeat: "repeat",
          opacity: 0.03,
        }}
      />
      <div className="absolute -top-8 -right-8 size-32 rounded-full bg-primary/20 blur-2xl pointer-events-none" />

      {/* Expanded QR overlay */}
      {qrExpanded && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 cursor-pointer"
          style={CARD_BG}
          onClick={(e) => { e.stopPropagation(); setQrExpanded(false); }}
        >
          <PassportQRCode userId={userId} size={180} />
          <p className="text-white/30 font-mono text-[7px] tracking-widest uppercase">Tap to close</p>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-white font-mono font-bold text-[9px] tracking-[0.16em]">UWDSC</span>
        <button
          className="p-0.5 rounded-sm hover:bg-white/10 transition-colors cursor-pointer"
          onClick={(e) => { e.stopPropagation(); setQrExpanded(true); }}
          aria-label="Show QR code"
        >
          <PassportQRCode userId={userId} size={24} />
        </button>
      </div>
      <div className="mx-3 h-px bg-white/10" />
      <div className="relative z-10 flex gap-2 px-3 pt-2.5 flex-1">
        <div className="shrink-0 flex flex-col items-start gap-1.5">
          <div className="w-9 h-11 border border-white/20 rounded-sm bg-white/5 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <MemberBadge isMember={isMember} membershipLoading={membershipLoading} />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div>
            <p className="text-white/25 font-mono text-[5.5px] tracking-[0.2em] uppercase mb-0.5">Surname</p>
            <p className="text-white font-mono text-[9px] tracking-wider truncate">{surname}</p>
          </div>
          <div>
            <p className="text-white/25 font-mono text-[5.5px] tracking-[0.2em] uppercase mb-0.5">Given Names</p>
            <p className="text-white font-mono text-[9px] tracking-wider truncate">{givenNames}</p>
          </div>
          {facultyLabel && (
            <div>
              <p className="text-white/25 font-mono text-[5.5px] tracking-[0.2em] uppercase mb-0.5">Faculty</p>
              <p className="text-white font-mono text-[9px] tracking-wider">{facultyLabel.toUpperCase()}</p>
            </div>
          )}
          {term && (
            <div>
              <p className="text-white/25 font-mono text-[5.5px] tracking-[0.2em] uppercase mb-0.5">Term</p>
              <p className="text-white font-mono text-[9px] tracking-wider">{term.toUpperCase()}</p>
            </div>
          )}
          {execPositionLabel && (
            <div>
              <p className="text-white/25 font-mono text-[5.5px] tracking-[0.2em] uppercase mb-0.5">Position</p>
              <p className="text-primary/80 font-mono text-[9px] tracking-wider truncate">{execPositionLabel.toUpperCase()}</p>
            </div>
          )}
        </div>
      </div>
      {email && (
        <p className="relative z-10 px-3 pt-1.5 text-white/20 font-mono text-[6px] truncate">{email}</p>
      )}
      <div className="relative z-10 mt-auto">
        <div className="mx-3 h-px bg-white/10 mb-1.5 mt-2" />
        <div className="px-2.5 pb-2.5 space-y-0.5">
          <p className="text-white/15 font-mono text-[5px] tracking-[0.03em] truncate">{mrzLine1}</p>
          <p className="text-white/15 font-mono text-[5px] tracking-[0.03em] truncate">{mrzLine2}</p>
        </div>
      </div>
    </div>
  );
}

function StampsPage() {
  return (
    <div
      className="relative w-full h-full flex flex-col select-none overflow-hidden"
      style={CARD_BG}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/logos/dsc.svg')",
          backgroundSize: "44px 44px",
          backgroundRepeat: "repeat",
          opacity: 0.03,
        }}
      />
      <div className="absolute -bottom-8 -left-8 size-28 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-white/30 font-mono text-[6px] tracking-[0.2em] uppercase">Stamps</span>
        <span className="text-white/15 font-mono text-[6px]">0</span>
      </div>
      <div className="mx-3 h-px bg-white/10" />
      <div className="relative z-10 px-3 pt-3 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded border border-dashed border-white/10 flex items-center justify-center"
          >
            <span className="text-white/10 font-mono text-[10px]">+</span>
          </div>
        ))}
      </div>
      <p className="relative z-10 mt-auto pb-3 text-center text-white/15 font-mono text-[6px] tracking-[0.16em] uppercase">
        No events yet
      </p>
    </div>
  );
}

function Cover({ shine }: { shine: MotionValue<string> }) {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden"
      style={CARD_BG}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/logos/dsc.svg')",
          backgroundSize: "52px 52px",
          backgroundRepeat: "repeat",
          opacity: 0.05,
        }}
      />
      <div className="absolute -top-10 -right-8 size-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 size-28 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
      <div className="absolute left-3 inset-y-4 w-px bg-white/10" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <Image src="/logos/dsc.svg" alt="UWDSC" width={52} height={52} />
        <div className="text-center space-y-1">
          <p className="text-white font-mono font-bold text-[11px] tracking-[0.18em]">UWDSC</p>
          <p className="text-white/50 font-mono text-[8px] tracking-[0.22em] uppercase">UWaterloo Data Science</p>
          <p className="text-white/30 font-mono text-[7px] tracking-[0.28em] uppercase">Club Member</p>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{ background: shine }}
      />
    </div>
  );
}

export function PassportCard(props: PassportCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const xSpring = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const scaleSpring = useSpring(1, { stiffness: 200, damping: 22 });
  const tiltX = useTransform(ySpring, [-0.5, 0.5], [6, -6]);
  const tiltY = useTransform(xSpring, [-0.5, 0.5], [-6, 6]);

  const coverAngle = useMotionValue(0);
  const coverSpring = useSpring(coverAngle, { stiffness: 90, damping: 20 });

  // Desktop: two-page spread. Mobile: single portrait card.
  const cardWidth = useTransform(
    coverSpring,
    [-180, 0],
    isMobile ? [W, W] : [W * 2, W]
  );
  const cardShift = useTransform(
    coverSpring,
    [-180, 0],
    isMobile ? [0, 0] : [0, W / 2]
  );

  const rightPageOpacity = useTransform(coverSpring, [-180, -90, 0], [1, 0, 0]);

  // Detect mobile on mount + resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shine = useTransform([xSpring, ySpring], ([x, y]) => {
    const angle = ((x as number) + 0.5) * 360;
    const gx = ((x as number) + 0.5) * 100;
    const gy = ((y as number) + 0.5) * 100;
    return [
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.10) 0%, transparent 40%)`,
      `linear-gradient(${angle}deg,` +
        `hsl(0deg 100% 70%/0.06),hsl(60deg 100% 70%/0.06),` +
        `hsl(120deg 100% 70%/0.06),hsl(180deg 100% 70%/0.06),` +
        `hsl(240deg 100% 70%/0.06),hsl(300deg 100% 70%/0.06),` +
        `hsl(360deg 100% 70%/0.06))`,
    ].join(", ");
  });

  const handleClick = () => {
    const next = !open;
    setOpen(next);
    coverAngle.set(next ? -180 : 0);
  };

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Positioned right-of-center when closed, shifts to center when open */}
      <motion.div className="mx-auto" style={{ width: cardWidth, x: cardShift }}>
        {/*
         * perspective: 400 — close-up, dramatic depth.
         * NO overflow-hidden — lets the cover's near edge pop toward the viewer
         * during the flip, which is what makes it feel physical.
         */}
        <div
          ref={ref}
          className="relative rounded-2xl shadow-2xl cursor-pointer"
          style={{ height: H, perspective: 400 }}
          onClick={handleClick}
          onMouseMove={(e) => {
            if (!ref.current) return;
            const { left, top, width, height } =
              ref.current.getBoundingClientRect();
            mouseX.set((e.clientX - left) / width - 0.5);
            mouseY.set((e.clientY - top) / height - 0.5);
          }}
          onMouseEnter={() => scaleSpring.set(1.03)}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
            scaleSpring.set(1);
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              rotateX: tiltX,
              rotateY: tiltY,
              scale: scaleSpring,
            }}
          >
            {/* Desktop: show stamps page + spine + bio page */}
            {/* Mobile: only show bio page (stamps live below as separate section) */}
            {!isMobile && (
              <>
                <div className="absolute inset-y-0 left-0" style={{ width: W }}>
                  <StampsPage />
                </div>
                <div
                  className="absolute inset-y-0 bg-white/15"
                  style={{ left: W, width: 1 }}
                />
              </>
            )}

            {/* Bio page — desktop: right side of spread. Mobile: behind the cover. */}
            <motion.div
              className="absolute inset-y-0"
              style={
                isMobile
                  ? { left: 0, width: W, opacity: rightPageOpacity }
                  : { left: W + 1, width: W - 1, opacity: rightPageOpacity }
              }
            >
              <BioPage {...props} />
            </motion.div>

            {/* Cover — the flip. originX:0 hinges it at the spine.
                No overflow parent means the near edge visibly arcs toward
                the viewer as it rotates, giving the physical flip feel. */}
            <div
              className="absolute inset-y-0 left-0 rounded-2xl"
              style={{ width: W }}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  originX: 0,
                  rotateY: coverSpring,
                  transformStyle: "preserve-3d",
                  translateZ: 1,
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Cover shine={shine} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground">
        {open ? "Click to close" : "Click to open"}
      </p>
    </motion.div>
  );
}
