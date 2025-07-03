"use client";
import {OrthographicCamera} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {Slider3DProvider, useSlider3DContext} from "./context";
import {Pagination} from "./pagination";
import {useRef} from "react";
import {useIsClient, useResizeObserver} from "usehooks-ts";

export const slides = [
    {
        image: "/slide-1.jpeg",
    },
    {
        image: "/slide-2.jpeg",
    },
    {
        image: "/slide-3.jpeg",
    },
    {
        image: "/slide-4.jpeg",
    },
];

const Slider3D = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {width = 0, height = 0} = useResizeObserver({
        // @ts-expect-error should have initial value
        ref: containerRef,
        box: "border-box",
    });
    const isClient = useIsClient();
    return (
        <div
            data-slot="slider-3d"
            className="relative size-full"
            ref={containerRef}>
            {isClient && (
                <Slider3DProvider
                    slides={slides}
                    containerSize={{width, height}}>
                    <Canvas>
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
                    <Pagination slides={slides} />
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
