import { useEffect, useRef } from 'react'
import qrcode from 'qrcode-generator'

const FINDER_SIZE = 7
const FINDER_GAP_SIZE = 5
const FINDER_CENTER_SIZE = 3

const drawHeart = (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    const topCurveHeight = size * 0.3
    ctx.moveTo(x + size / 2, y + size * 0.2)
    ctx.bezierCurveTo(
        x + size / 2,
        y + size * 0.2 - topCurveHeight,
        x,
        y + size * 0.2 - topCurveHeight,
        x,
        y + size * 0.35
    )
    ctx.bezierCurveTo(x, y + size * 0.6, x + size / 2, y + size * 0.9, x + size / 2, y + size)
    ctx.bezierCurveTo(x + size / 2, y + size * 0.9, x + size, y + size * 0.6, x + size, y + size * 0.35)
    ctx.bezierCurveTo(
        x + size,
        y + size * 0.2 - topCurveHeight,
        x + size / 2,
        y + size * 0.2 - topCurveHeight,
        x + size / 2,
        y + size * 0.2
    )
    ctx.fill()
}

const drawDiamond = (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x + size / 2, y)
    ctx.lineTo(x + size, y + size / 2)
    ctx.lineTo(x + size / 2, y + size)
    ctx.lineTo(x, y + size / 2)
    ctx.fill()
}

const drawRoundedRect = (ctx, x, y, width, height, radius, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, radius)
    ctx.fill()
}

const drawCircle = (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
}

const drawSquare = (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
}

const drawModule = (ctx, x, y, size, style, color) => {
    const styles = {
        dots: () => drawCircle(ctx, x, y, size, color),
        rounded: () => drawRoundedRect(ctx, x, y, size, size, size * 0.5, color),
        'extra-rounded': () => drawRoundedRect(ctx, x, y, size, size, size * 0.5, color),
        classy: () => drawRoundedRect(ctx, x, y, size, size, [size / 2, 0, size / 2, 0], color),
        'classy-rounded': () => drawRoundedRect(ctx, x, y, size, size, [0, size / 2, 0, size / 2], color),
        heart: () => drawHeart(ctx, x, y, size, color),
        diamond: () => drawDiamond(ctx, x, y, size, color),
    }

    const draw = styles[style] || (() => drawSquare(ctx, x, y, size, color))
    draw()
}

const drawEyeShape = (ctx, x, y, size, style, color) => {
    if (style === 'dot' || style === 'circle') {
        drawCircle(ctx, x, y, size, color)
        return
    }

    if (style === 'extra-rounded') {
        drawRoundedRect(ctx, x, y, size, size, size * 0.4, color)
        return
    }

    if (style === 'rounded') {
        drawRoundedRect(ctx, x, y, size, size, size * 0.2, color)
        return
    }

    drawModule(ctx, x, y, size, style, color)
}

const eraseEyeShape = (ctx, x, y, size, style) => {
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    drawEyeShape(ctx, x, y, size, style, '#000000')
    ctx.restore()
}

const isFinderPattern = (row, col, count) => {
    const nearTop = row < FINDER_SIZE
    const nearLeft = col < FINDER_SIZE
    const nearRight = col >= count - FINDER_SIZE
    const nearBottom = row >= count - FINDER_SIZE

    return (nearTop && nearLeft) || (nearTop && nearRight) || (nearBottom && nearLeft)
}

export const CustomQRCode = ({
    value = '',
    size = 300,
    bgColor = '#FFFFFF',
    fgColor = '#000000',
    logoImage = '',
    logoSize = 60,
    logoOpacity = 1,
    qrStyle = 'square',
    eyeColor = [],
    eyeOuterStyle = 'square',
    eyeInnerStyle = 'square',
    quietZone = 20,
    errorCorrectionLevel = 'H',
    id = 'qr-gen',
}) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const qr = qrcode(0, errorCorrectionLevel)
        qr.addData(value)
        qr.make()

        const count = qr.getModuleCount()
        const ctx = canvas.getContext('2d')
        const availableSize = size - 2 * quietZone
        const moduleSize = availableSize / count

        canvas.width = size
        canvas.height = size
        ctx.clearRect(0, 0, size, size)
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, size, size)

        for (let row = 0; row < count; row++) {
            for (let col = 0; col < count; col++) {
                if (!qr.isDark(row, col) || isFinderPattern(row, col, count)) continue

                drawModule(
                    ctx,
                    quietZone + col * moduleSize,
                    quietZone + row * moduleSize,
                    moduleSize,
                    qrStyle,
                    fgColor
                )
            }
        }

        [
            { row: 0, col: 0 },
            { row: 0, col: count - FINDER_SIZE },
            { row: count - FINDER_SIZE, col: 0 },
        ].forEach((finder, index) => {
            const x = quietZone + finder.col * moduleSize
            const y = quietZone + finder.row * moduleSize
            const outerSize = FINDER_SIZE * moduleSize
            const gapSize = FINDER_GAP_SIZE * moduleSize
            const innerSize = FINDER_CENTER_SIZE * moduleSize
            const outerColor = eyeColor[index]?.outer || fgColor
            const innerColor = eyeColor[index]?.inner || outerColor
            const gapOffset = (outerSize - gapSize) / 2
            const innerOffset = (outerSize - innerSize) / 2

            drawEyeShape(ctx, x, y, outerSize, eyeOuterStyle, outerColor)
            eraseEyeShape(ctx, x + gapOffset, y + gapOffset, gapSize, eyeOuterStyle)
            drawEyeShape(ctx, x + gapOffset, y + gapOffset, gapSize, eyeOuterStyle, bgColor)
            drawEyeShape(ctx, x + innerOffset, y + innerOffset, innerSize, eyeInnerStyle, innerColor)
        })

        if (!logoImage || logoSize <= 0) return

        const img = new Image()
        img.src = logoImage
        img.onload = () => {
            const position = (size - logoSize) / 2
            ctx.globalAlpha = logoOpacity
            ctx.drawImage(img, position, position, logoSize, logoSize)
            ctx.globalAlpha = 1
        }
    }, [
        bgColor,
        errorCorrectionLevel,
        eyeColor,
        eyeInnerStyle,
        eyeOuterStyle,
        fgColor,
        logoImage,
        logoOpacity,
        logoSize,
        qrStyle,
        quietZone,
        size,
        value,
    ])

    return (
        <canvas
            id={id}
            ref={canvasRef}
            style={{ width: size, maxWidth: '100%', height: 'auto' }}
        />
    )
}
