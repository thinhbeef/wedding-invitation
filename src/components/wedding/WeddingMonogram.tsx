import { useId } from 'react';

interface Props {
  className?: string;
}

// The sweeping T crosses the upright Y with a narrow, transparent separation.
const T_STEM = `
  M724 398
  C678 395 632 429 597 473
  C550 530 511 630 453 749
  C413 831 365 879 310 888
  C264 896 225 871 225 829
  C225 806 237 783 242 766
  C249 748 245 741 236 745
  C205 749 197 790 212 835
  C226 877 266 900 303 899
  C390 897 459 829 506 738
  L611 528
  C649 455 687 407 724 407
  C730 407 731 398 724 398Z
`;

/** Calligraphic T/Y monogram, drawn as transparent vector letterforms. */
export function WeddingMonogram({ className }: Props) {
  const weaveMaskId = useId();

  return (
    <svg viewBox="185 270 830 665" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <defs>
        <mask id={weaveMaskId} x="185" y="270" width="830" height="665" maskUnits="userSpaceOnUse">
          <rect x="185" y="270" width="830" height="665" fill="white" />
          <path d={T_STEM} fill="black" stroke="black" strokeWidth="14" strokeLinejoin="round" />
        </mask>
      </defs>

      {/* Hairline loops and the broad, sweeping crossbar of the T. */}
      <path d="M787 403C709 373 654 341 578 314C482 279 392 295 338 341C287 385 275 445 294 505C309 555 345 582 393 580C455 580 489 551 489 509C489 495 486 482 480 471C477 463 487 458 491 467C502 490 502 519 491 541C477 572 444 590 401 589C345 589 303 559 287 511C266 449 279 386 324 342C380 287 477 276 555 300C634 318 705 350 788 381Z" />
      <path d="M827 400C888 422 952 425 977 398C994 378 984 349 942 347C936 346 936 337 943 337C980 338 1000 354 989 385C982 425 921 443 819 412Z" />

      {/* High-contrast serif Y; the mask lets the T pass in front cleanly. */}
      <path
        mask={`url(#${weaveMaskId})`}
        d="M397 338H553V344C520 347 529 376 550 411L690 651L783 439C812 374 797 349 744 344V338H915V344C870 346 832 381 805 437L696 667V824C696 888 700 900 749 903V910H592V903C641 900 644 888 644 824V662L491 407C466 366 431 345 397 344Z"
      />
      <path d={T_STEM} />
    </svg>
  );
}
