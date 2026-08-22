export function WorkshopsHero() {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="bg-primary/20 pointer-events-none absolute left-1/2 top-0 -z-10 h-112 w-md -translate-x-1/2 -translate-y-1/3 rounded-full blur-[120px]" />

      <h1 className="my-14 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">Workshops</h1>
      <p className="mx-auto mb-14 max-w-2xl text-sm text-grey2 sm:text-lg">
        Hands-on sessions covering the data science toolkit, from first-principles statistics to
        modern deep learning.
        <br />
        Come for a single session or follow along all term — every workshop stands on its own.
      </p>
    </div>
  );
}
