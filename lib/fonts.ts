import {Oswald, Quattrocento} from "next/font/google";

const oswald = Oswald({
    variable: "--font-oswald",
    display: "swap",
    weight: ["300", "400", "500", "700"],
});

const quattrocento = Quattrocento({
    variable: "--font-quattrocento",
    display: "swap",
    weight: ["400", "700"],
});

export {oswald, quattrocento};
