import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { CustomQRCode } from "./CustomQRCode";
import { Button } from "./ui/Button";
import { FormatSelector } from "./Controls/FormatSelector";

const MIME_TYPES = {
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
};

const sanitizeFileName = (name) => {
    const cleanName = name.trim().replace(/[\\/:*?"<>|]+/g, "-");
    return cleanName || "qrcode";
};

export const QRCodeGenerator = ({ options }) => {
    const [fileExt, setFileExt] = useState("png");

    const eyeColor = useMemo(() => {
        const colors = {
            outer: options.cornersSquareOptions.color,
            inner: options.cornersDotOptions.color,
        };

        return [colors, colors, colors];
    }, [options.cornersDotOptions.color, options.cornersSquareOptions.color]);

    const onDownloadClick = () => {
        const canvas = document.getElementById("qr-gen");
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = `${sanitizeFileName(options.fileName)}.${fileExt}`;
        link.href = canvas.toDataURL(MIME_TYPES[fileExt]);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="sticky top-8 flex flex-col gap-4">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#285A48] p-6">
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 150, damping: 22 }}
                    className="max-w-full overflow-hidden rounded-xl bg-[#B0E4CC] p-4"
                >
                    <CustomQRCode
                        id="qr-gen"
                        value={options.data}
                        size={options.size}
                        bgColor={options.backgroundOptions.color}
                        fgColor={options.dotsOptions.color}
                        logoImage={options.image}
                        logoSize={options.logoSize}
                        logoOpacity={options.logoOpacity / 100}
                        qrStyle={options.dotsOptions.type}
                        eyeOuterStyle={options.cornersSquareOptions.type}
                        eyeInnerStyle={options.cornersDotOptions.type}
                        eyeColor={eyeColor}
                        quietZone={options.quietZone}
                        errorCorrectionLevel={options.errorCorrectionLevel}
                    />
                </motion.div>
            </div>

            <div className="flex gap-2">
                <FormatSelector
                    value={fileExt}
                    onChange={setFileExt}
                    options={["png", "jpeg", "webp"]}
                />
                <Button onClick={onDownloadClick} className="flex-1 gap-2">
                    <Download className="h-4 w-4" /> Download
                </Button>
            </div>
        </div>
    );
};
