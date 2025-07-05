import {cn} from "@/lib/utilities/cn";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/dist/SplitText";
import Image from "next/image";
import {RefObject, useRef, useState} from "react";
import {Slide} from ".";
import {useSlider3DContext} from "./context";

gsap.registerPlugin(SplitText);

interface PaginationProps {
    slides: Slide[];
    containerRef?: RefObject<HTMLDivElement | null>;
    contentRefs?: RefObject<(HTMLDivElement | null)[]>;
}

const TIME_INTERVAL = 5; // Seconds

const Pagination: React.FC<PaginationProps> = ({
    slides,
    containerRef,
    contentRefs,
}) => {
    const {
        currentSlideIndex,
        handleSlideChange,
        isTransitioning,
        shaderMaterial,
        lastSlideIndex,
    } = useSlider3DContext();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [activeIndex, setActiveIndex] = useState(
        currentSlideIndex.current ?? 0
    );

    const goToSlide = (index: number) => {
        if (isTransitioning.current) return;
        handleSlideChange(index);
        setActiveIndex(index);
    };

    const animateText = (
        element: HTMLElement | null,
        from: gsap.TweenVars,
        to: gsap.TweenVars,
        staggerFrom: "center" | "start"
    ) => {
        if (!element) return;
        const split = new SplitText(element, {
            type: "chars,lines,words",
            mask: "lines",
            smartWrap: true,
            autoSplit: true,
        });
        gsap.fromTo(split.chars, from, {
            ...to,
            duration: 1,
            ease: "power2.out",
            stagger: {amount: 0.1, from: staggerFrom},
        });
    };

    const animateList = (
        element: HTMLElement | NodeListOf<Element> | null,
        from: gsap.TweenVars,
        to: gsap.TweenVars
    ) => {
        if (!element) return;

        gsap.fromTo(
            element,
            {
                ...from,
            },
            {
                ...to,
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.05,
                delay: 0.2,
            }
        );
    };

    useGSAP(
        () => {
            if (!containerRef?.current) return;

            // Auto-slide interval
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                goToSlide((activeIndex + 1) % slides.length);
            }, TIME_INTERVAL * 1000);

            // Progress bar animation
            gsap.fromTo(
                containerRef.current,
                {[`--coninc-${activeIndex}`]: "100%"},
                {
                    [`--coninc-${activeIndex}`]: "0%",
                    duration: TIME_INTERVAL,
                    ease: "none",
                }
            );

            // Handle content animations
            if (!contentRefs?.current) return;

            // Reset non-active slides
            contentRefs.current.forEach((el, index) => {
                const isActive =
                    index === activeIndex || index === lastSlideIndex.current;
                if (isActive || !el) return;

                const title = el.querySelector(".title");
                const description = el.querySelector(".description");
                const list = el.querySelector(".list");

                gsap.set([title, description, list], {
                    autoAlpha: 0,
                });
            });

            // Animate out last slide
            if (lastSlideIndex.current !== null) {
                const lastContent = contentRefs.current[lastSlideIndex.current];
                if (lastContent) {
                    animateText(
                        lastContent.querySelector(".title"),
                        {yPercent: 0},
                        {yPercent: 100},
                        "center"
                    );
                    animateText(
                        lastContent.querySelector(".description"),
                        {yPercent: 0},
                        {yPercent: 100, delay: 0.2},
                        "start"
                    );
                    animateList(
                        lastContent.querySelectorAll("ul li span"),
                        {yPercent: 0},
                        {yPercent: 100, delay: 0.3}
                    );
                }
            }

            // Animate in current slide
            const currentContent = contentRefs.current[activeIndex];
            if (currentContent) {
                animateText(
                    currentContent.querySelector(".title"),
                    {yPercent: -100},
                    {yPercent: 0},
                    "center"
                );
                animateText(
                    currentContent.querySelector(".description"),
                    {yPercent: -100},
                    {yPercent: 0, delay: 0.2},
                    "start"
                );
                animateList(
                    currentContent.querySelectorAll("ul li span"),
                    {yPercent: -100},
                    {yPercent: 0, delay: 0.3}
                );
            }
        },
        {
            scope: containerRef,
            dependencies: [activeIndex, shaderMaterial.uuid],
            revertOnUpdate: true,
        }
    );

    return (
        <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-x-2 gap-y-3 lg:top-10 lg:right-10 lg:bottom-auto lg:left-auto lg:flex-col">
            {slides.map(({image}, index) => (
                <button
                    key={index}
                    className={cn(
                        "shadow-ev-bg-default relative h-12 w-14 rounded-md shadow-xl transition-[height,width] duration-500 ease-in-out hover:opacity-100 lg:h-10 lg:w-24",
                        activeIndex === index && "w-20 lg:h-18 lg:w-24"
                    )}
                    onClick={() => goToSlide(index)}>
                    <Image
                        alt=""
                        src={image}
                        fill
                        sizes="96px"
                        className="rounded-md object-cover opacity-30 transition-opacity duration-600 ease-in-out"
                    />
                    <Image
                        alt=""
                        src={image}
                        fill
                        sizes="96px"
                        style={{
                            clipPath: `inset(0px 0px var(--coninc-${index}) 0px)`,
                        }}
                        className={cn(
                            "rounded-md object-cover opacity-0 transition-opacity duration-600 ease-in-out",
                            activeIndex === index && "opacity-100"
                        )}
                    />
                </button>
            ))}
        </div>
    );
};

export default Pagination;
