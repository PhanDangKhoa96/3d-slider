import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {useSlider3DContext} from "./context";
import {cn} from "@/lib/utilities/cn";

interface PaginationProps {
    slides: {image: string}[];
}

const TIME_INTERVAL = 5;

const Pagination = ({slides}: PaginationProps) => {
    const {
        currentSlideIndex,
        handleSlideChange,
        isTransitioning,
        shaderMaterial,
    } = useSlider3DContext();
    const interval = useRef<NodeJS.Timeout>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(
        currentSlideIndex.current ?? 0
    );

    const goToSlide = (index: number) => {
        if (isTransitioning.current) return;

        handleSlideChange(index);
        setActiveIndex(index);
    };

    useGSAP(
        () => {
            if (interval.current) clearInterval(interval.current);
            interval.current = setInterval(() => {
                goToSlide((activeIndex + 1) % slides.length);
            }, TIME_INTERVAL * 1000);
            const cssVar = `--coninc-${activeIndex}`;

            gsap.fromTo(
                containerRef.current,
                {
                    [cssVar]: "0%",
                },
                {
                    [cssVar]: "100%",
                    duration: TIME_INTERVAL,
                    ease: "none",
                }
            );
        },
        {
            scope: containerRef,
            dependencies: [activeIndex, shaderMaterial.uuid],
        }
    );

    return (
        <div
            className="absolute top-10 right-10 flex flex-col gap-y-3"
            ref={containerRef}>
            {slides.map(({image}, index) => (
                <button
                    key={index}
                    className={cn(
                        "shadow-ev-bg-default relative h-10 w-24 rounded-md opacity-30 shadow-xl transition-[height,opacity] duration-1100 ease-in-out hover:opacity-100",
                        activeIndex === index && "h-18 opacity-100"
                    )}
                    onClick={() => goToSlide(index)}>
                    <span
                        style={{
                            backgroundImage: `conic-gradient(currentColor, currentColor var(--coninc-${index}), transparent var(--coninc-${index}))`,
                        }}
                        className={cn(
                            "text-ev-bg-primary absolute -inset-px block rounded-md opacity-0 transition-opacity duration-1100 ease-in-out",
                            activeIndex === index && "opacity-100"
                        )}
                    />
                    <Image
                        alt=""
                        src={image}
                        fill
                        sizes="96px"
                        className="rounded-md object-cover"
                    />
                </button>
            ))}
        </div>
    );
};

export {Pagination};
