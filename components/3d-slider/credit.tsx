import Link from "next/link";

const Credit = () => {
    return (
        <div className="fixed top-10 flex w-full justify-between px-5 lg:top-auto lg:bottom-10 lg:px-10">
            <div className="text-white">
                Made by{" "}
                <Link
                    href={"https://www.pldkhoa.dev"}
                    target="_blank"
                    className="underline underline-offset-2 hover:no-underline">
                    Khoa Phan
                </Link>{" "}
            </div>

            <Link
                href={"https://github.com/PhanDangKhoa96/3d-slider"}
                target="_blank"
                className="text-white underline underline-offset-2 hover:no-underline">
                Github
            </Link>
        </div>
    );
};

export {Credit};
