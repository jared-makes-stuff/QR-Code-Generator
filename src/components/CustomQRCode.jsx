import React, { useEffect, useRef } from 'react';
import qrcode from 'qrcode-generator';

export const CustomQRCode = ({
    value = '',
    size = 300,
    bgColor = '#FFFFFF',
    fgColor = '#000000',
    logoImage = '',
    logoWidth = 60,
    logoHeight = 60,
    logoOpacity = 1,
    qrStyle = 'squares', // 'squares' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded' | 'heart' | 'diamond'
    eyeRadius = 0, // Not used
    eyeColor = [], // [{ outer, inner }, ...]
    eyeOuterStyle = 'square', // 'square' | 'circle' | 'heart' | 'rounded' | 'extra-rounded' | 'diamond'
    eyeInnerStyle = 'square', // 'square' | 'circle' | 'heart' | 'rounded' | 'extra-rounded' | 'diamond'
    quietZone = 20,
    id = 'qr-gen',
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // 1. Generate QR Data
        const typeNumber = 0; // Auto detection
        const errorCorrectionLevel = 'H';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(value);
        qr.make();

        const count = qr.getModuleCount();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // 2. Setup Canvas
        // Fit to size:
        const availableSize = size - 2 * quietZone;
        const moduleSize = availableSize / count;

        canvas.width = size;
        canvas.height = size;

        // Fill Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);

        // Helper to check if a module is part of the 3 finder patterns
        const isFinderPattern = (row, col) => {
            if (row < 7 && col < 7) return true; // Top-Left
            if (row < 7 && col >= count - 7) return true; // Top-Right
            if (row >= count - 7 && col < 7) return true; // Bottom-Left
            return false;
        };

        // --- SHAPE HELPERS ---

        const drawHeart = (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            const topCurveHeight = size * 0.3;
            ctx.moveTo(x + size / 2, y + size * 0.2);
            ctx.bezierCurveTo(
                x + size / 2, y + size * 0.2 - topCurveHeight,
                x, y + size * 0.2 - topCurveHeight,
                x, y + size * 0.2 + size * 0.15
            );
            ctx.bezierCurveTo(
                x, y + size * 0.6,
                x + size / 2, y + size * 0.9,
                x + size / 2, y + size
            );
            ctx.bezierCurveTo(
                x + size / 2, y + size * 0.9,
                x + size, y + size * 0.6,
                x + size, y + size * 0.2 + size * 0.15
            );
            ctx.bezierCurveTo(
                x + size, y + size * 0.2 - topCurveHeight,
                x + size / 2, y + size * 0.2 - topCurveHeight,
                x + size / 2, y + size * 0.2
            );
            ctx.fill();
            ctx.closePath();
        };

        const drawDiamond = (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + size / 2, y);
            ctx.lineTo(x + size, y + size / 2);
            ctx.lineTo(x + size / 2, y + size);
            ctx.lineTo(x, y + size / 2);
            ctx.fill();
            ctx.closePath();
        };

        const drawRoundedRect = (ctx, x, y, w, h, radii, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, radii);
            ctx.fill();
        };

        const drawCircle = (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.fill();
        };

        // 3. Draw Modules (Data)
        ctx.fillStyle = fgColor;
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (qr.isDark(r, c) && !isFinderPattern(r, c)) {
                    const x = quietZone + c * moduleSize;
                    const y = quietZone + r * moduleSize;
                    const w = moduleSize;
                    const h = moduleSize;

                    if (qrStyle === 'dots') {
                        drawCircle(ctx, x, y, w, fgColor);
                    } else if (qrStyle === 'rounded') {
                        drawRoundedRect(ctx, x, y, w, h, w * 0.5, fgColor);
                    } else if (qrStyle === 'extra-rounded') {
                        drawRoundedRect(ctx, x, y, w, h, w / 2, fgColor);
                    } else if (qrStyle === 'heart') {
                        drawHeart(ctx, x, y, w, fgColor);
                    } else if (qrStyle === 'diamond') {
                        drawDiamond(ctx, x, y, w, fgColor);
                    } else if (qrStyle === 'classy') {
                        drawRoundedRect(ctx, x, y, w, h, [w / 2, 0, w / 2, 0], fgColor);
                    } else if (qrStyle === 'classy-rounded') {
                        drawRoundedRect(ctx, x, y, w, h, [0, w / 2, 0, w / 2], fgColor);
                    } else {
                        // Square
                        ctx.fillStyle = fgColor;
                        ctx.fillRect(x, y, w, h);
                    }
                }
            }
        }

        // 4. Draw Finder Patterns (Eyes)
        // We decouple Outer Frame and Inner Center

        // Helper to draw a shape at a specific grid position with size
        const drawEyeShape = (ctx, x, y, size, style, color) => {
            if (style === 'circle' || style === 'dot') {
                drawCircle(ctx, x, y, size, color);
            } else if (style === 'heart') {
                drawHeart(ctx, x, y, size, color);
            } else if (style === 'diamond') {
                drawDiamond(ctx, x, y, size, color);
            } else if (style === 'extra-rounded') {
                drawRoundedRect(ctx, x, y, size, size, size * 0.4, color); // 40% radius relative to size
            } else if (style === 'rounded') {
                drawRoundedRect(ctx, x, y, size, size, size * 0.2, color); // 20% radius
            } else {
                // Square
                ctx.fillStyle = color;
                ctx.fillRect(x, y, size, size);
            }
        };

        const finders = [
            { r: 0, c: 0 },
            { r: 0, c: count - 7 },
            { r: count - 7, c: 0 }
        ];

        finders.forEach((f, index) => {
            const x = quietZone + f.c * moduleSize;
            const y = quietZone + f.r * moduleSize;

            // Standard sizes in modules
            // Full Eye: 7x7
            // Frame is 7x7 with 5x5 hole.
            // Center is 3x3.

            const outerSize = 7 * moduleSize;
            const gapSize = 5 * moduleSize;
            const innerSize = 3 * moduleSize;

            // Colors
            const outerColor = (eyeColor[index] && eyeColor[index].outer) || fgColor;
            const innerColor = (eyeColor[index] && eyeColor[index].inner) || outerColor;

            // 1. Draw Outer Frame Solid
            drawEyeShape(ctx, x, y, outerSize, eyeOuterStyle, outerColor);

            // 2. Clear out the gap (draw bg color shape) using the SAME shape as outer
            // We need to center the gap inside the outer shape.
            const gapOffset = (outerSize - gapSize) / 2;
            drawEyeShape(ctx, x + gapOffset, y + gapOffset, gapSize, eyeOuterStyle, bgColor);

            // 3. Draw Inner Center with its own style
            const innerOffset = (outerSize - innerSize) / 2;
            drawEyeShape(ctx, x + innerOffset, y + innerOffset, innerSize, eyeInnerStyle, innerColor);
        });

        // 5. Draw Logo
        if (logoImage) {
            const img = new Image();
            img.src = logoImage;
            img.onload = () => {
                const logoW = logoWidth;
                const logoH = logoHeight;
                const lx = (size - logoW) / 2;
                const ly = (size - logoH) / 2;

                ctx.globalAlpha = logoOpacity;
                ctx.drawImage(img, lx, ly, logoW, logoH);
                ctx.globalAlpha = 1.0;
            };
        }

    }, [value, size, bgColor, fgColor, logoImage, logoWidth, logoHeight, logoOpacity, qrStyle, eyeRadius, eyeColor, eyeOuterStyle, eyeInnerStyle, quietZone]);

    return (
        <canvas
            id={id}
            ref={canvasRef}
            style={{ width: size, height: size, maxWidth: '100%', height: 'auto' }}
        />
    );
};
