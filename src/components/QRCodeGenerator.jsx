import React, { useState } from "react";
import { CustomQRCode } from "./CustomQRCode";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Download } from "lucide-react";
import { FormatSelector } from "./Controls/FormatSelector";

export const QRCodeGenerator = ({ options }) => {
    const [fileExt, setFileExt] = useState("png");

    // Map options to props for CustomQRCode

    // Eye Colors (Inner vs Outer)
    const eyeColor = [
        { outer: options.cornersSquareOptions.color, inner: options.cornersDotOptions.color },
        { outer: options.cornersSquareOptions.color, inner: options.cornersDotOptions.color },
        { outer: options.cornersSquareOptions.color, inner: options.cornersDotOptions.color },
    ];

    // Handle Download
    const onDownloadClick = () => {
        const canvas = document.getElementById("qr-gen");
        if (canvas) {
            const url = canvas.toDataURL(`image/${fileExt}`);
            const link = document.createElement("a");
            link.download = `qrcode.${fileExt}`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="sticky top-10 flex flex-col gap-6">
            <Card className="p-8 flex items-center justify-center bg-white/5 border-white/10 aspect-square overflow-hidden relative group">
                <div className="shadow-2xl rounded-xl overflow-hidden bg-white p-4">
                    <CustomQRCode
                        id="qr-gen"
                        value={options.data}
                        size={300}
                        bgColor={options.backgroundOptions.color}
                        fgColor={options.dotsOptions.color}
                        logoImage={options.image}
                        logoWidth={60}
                        logoHeight={60}
                        logoOpacity={1}
                        qrStyle={options.dotsOptions.type}
                        eyeOuterStyle={options.cornersSquareOptions.type}
                        eyeInnerStyle={options.cornersDotOptions.type}
                        eyeColor={eyeColor}
                        quietZone={20}
                    />
                </div>
            </Card>

            <div className="flex gap-2">
                <FormatSelector
                    value={fileExt}
                    onChange={setFileExt}
                    options={["png", "jpeg", "webp"]}
                />
                <Button onClick={onDownloadClick} className="flex-1 gap-2">
                    <Download className="w-4 h-4" /> Download
                </Button>
            </div>
        </div>
    );
};
