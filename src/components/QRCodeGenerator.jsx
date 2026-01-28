import React, { useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Download } from "lucide-react";
import { FormatSelector } from "./Controls/FormatSelector";

export const QRCodeGenerator = ({ options }) => {
    const [fileExt, setFileExt] = useState("png");

    // Map options to react-qrcode-logo props
    const qrStyle = options.dotsOptions.type === 'dots' || options.dotsOptions.type === 'classy' ? 'dots' : 'squares';

    // Map eyeRadius based on cornersSquareOptions
    // Use array of objects for precise Inner/Outer control if supported, or fallbacks.
    let eyeRadius = 0;
    if (options.cornersSquareOptions.type === 'dot') {
        // Attempt to set both inner and outer radii to 50% (circle)
        eyeRadius = [
            { outer: [50, 50, 50, 50], inner: [50, 50, 50, 50] },
            { outer: [50, 50, 50, 50], inner: [50, 50, 50, 50] },
            { outer: [50, 50, 50, 50], inner: [50, 50, 50, 50] },
        ];
    } else if (options.cornersSquareOptions.type === 'extra-rounded') {
        eyeRadius = 15;
    } else if (options.cornersSquareOptions.type === 'rounded') {
        eyeRadius = 8;
    }

    // Map Eye Colors (Inner vs Outer)
    // eyeColor can be strings or array of objects
    // react-qrcode-logo expects array of 3 objects for corners: [TopLeft, TopRight, BottomLeft]
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
                    <QRCode
                        id="qr-gen"
                        value={options.data}
                        size={300} // fixed size for preview
                        bgColor={options.backgroundOptions.color}
                        fgColor={options.dotsOptions.color}
                        logoImage={options.image}
                        logoWidth={60}
                        logoHeight={60}
                        logoOpacity={1}
                        qrStyle={qrStyle}
                        eyeRadius={eyeRadius}
                        eyeColor={eyeColor}
                        ecLevel="H"
                        quietZone={20}
                        enableCORS={true} // Ensure images load safely
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
