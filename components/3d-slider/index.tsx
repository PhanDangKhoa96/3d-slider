"use client";
import {OrthographicCamera} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {Slider3DProvider, useSlider3DContext} from "./context";
import Pagination from "./pagination";
import {useEffect, useRef, useState} from "react";
import {useIsClient, useResizeObserver} from "usehooks-ts";
import {Content} from "./content";
import {Credit} from "./credit";

export interface Slide {
    image: string;
    title: string;
    description: string;
    type: string;
    field: string;
    date: string;
}

export const slides: Slide[] = [
    {
        title: "Echo Forms",
        description:
            "A generative art experiment that visualizes sound vibrations through blurred motion and abstract shapes. The project explores the intersection of audio input and fluid visuals.",
        type: "Experimental Visual",
        field: "Creative Coding / Motion Design",
        date: "March 2025",
        image: "/slide-1.jpeg",
    },
    {
        title: "Dream Mesh",
        description:
            "An ambient visual series that distorts geometric grids into flowing, organic compositions. Inspired by lucid dreaming states and soft color transitions.",
        type: "Visual Series",
        field: "Digital Art / Abstract UI Concepts",
        date: "February 2025",
        image: "/slide-2.jpeg",
    },
    {
        title: "Mist UI",
        description:
            "A conceptual UI design where interface elements melt into the background, emphasizing atmosphere over clarity. Designed for meditation or ambient music platforms.",
        type: "UI Concept",
        field: "Product Design / Experimental UI",
        date: "April 2025",
        image: "/slide-3.png",
    },
    {
        title: "Phantom Flow",
        description:
            "A kinetic art piece simulating emotional rhythms using shifting gradients and diffused shapes. It reflects how moods ebb and flow in a digital environment.",
        type: "Motion Graphic",
        field: "Visual Storytelling / Emotion Design",
        date: "January 2025",
        image: "/slide-4.jpeg",
    },
];

const Slider3D = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    const {width = 0, height = 0} = useResizeObserver({
        // @ts-expect-error should have initial value
        ref: containerRef,
        box: "border-box",
    });
    const isClient = useIsClient();
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        let resizeTimer: NodeJS.Timeout;

        const handleResize = () => {
            setIsResizing(true);

            // Debounce to detect when resizing stops
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setIsResizing(false);
            }, 50);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    return (
        <div
            data-slot="slider-3d"
            className="relative size-full"
            ref={containerRef}>
            {isClient && (
                <Slider3DProvider
                    slides={slides}
                    containerSize={{width, height}}>
                    {!isResizing && (
                        <Canvas className="brightness-80">
                            <OrthographicCamera
                                makeDefault
                                left={-1}
                                right={1}
                                top={1}
                                bottom={-1}
                                near={0}
                                far={1}
                            />
                            <ShaderPlane />
                        </Canvas>
                    )}
                    <Content contentRefs={contentRefs} slides={slides} />
                    <Pagination
                        containerRef={containerRef}
                        slides={slides}
                        contentRefs={contentRefs}
                    />
                    <Credit />
                </Slider3DProvider>
            )}
        </div>
    );
};

function ShaderPlane({}) {
    const {shaderMaterial} = useSlider3DContext();

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
}

export {Slider3D};
