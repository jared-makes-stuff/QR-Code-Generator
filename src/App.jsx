import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { Layout } from './components/Layout'
import { QRCodeGenerator } from './components/QRCodeGenerator'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card'
import { Button } from './components/ui/Button'
import { Input } from './components/ui/Input'
import { Label } from './components/ui/Label'
import { ColorPicker } from './components/Controls/ColorPicker'
import { LogoUpload } from './components/Controls/LogoUpload'
import { SliderControl } from './components/Controls/SliderControl'
import { OptionSelector } from './components/Controls/OptionSelector'

const DEFAULT_OPTIONS = {
    dotsOptions: { color: '#000000', type: 'rounded' },
    backgroundOptions: { color: '#FFFFFF' },
    cornersSquareOptions: { type: 'extra-rounded', color: '#000000' },
    cornersDotOptions: { type: 'dot', color: '#000000' },
    errorCorrectionLevel: 'H',
    fileName: 'qrcode',
    image: '',
    logoOpacity: 100,
    logoSize: 64,
    quietZone: 32,
    size: 512,
}

const DOT_SHAPES = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'dots', label: 'Dots' },
    { id: 'classy', label: 'Classy' },
    { id: 'classy-rounded', label: 'Classy R' },
    { id: 'extra-rounded', label: 'Extra R' },
    { id: 'heart', label: 'Heart' },
    { id: 'diamond', label: 'Diamond' },
]

const EYE_FRAME_SHAPES = [
    { id: 'square', label: 'Square' },
    { id: 'extra-rounded', label: 'Rounded' },
    { id: 'dot', label: 'Circle' },
    { id: 'heart', label: 'Heart' },
    { id: 'diamond', label: 'Diamond' },
]

const EYE_CENTER_SHAPES = [
    { id: 'square', label: 'Square' },
    { id: 'dot', label: 'Circle' },
    { id: 'heart', label: 'Heart' },
    { id: 'diamond', label: 'Diamond' },
]

const ERROR_CORRECTION_OPTIONS = [
    { id: 'L', label: 'L' },
    { id: 'M', label: 'M' },
    { id: 'Q', label: 'Q' },
    { id: 'H', label: 'H' },
]

const pageMotion = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 84,
            damping: 20,
            mass: 0.8,
            staggerChildren: 0.06,
            delayChildren: 0.04,
        },
    },
}

const itemMotion = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 130, damping: 22 },
    },
}

function App() {
    const defaultUrl = import.meta.env.VITE_DEFAULT_URL || 'https://example.com'
    const appTitle = import.meta.env.VITE_APP_TITLE || 'QR Studio'
    const logoUrl = import.meta.env.VITE_LOGO_URL
    const [url, setUrl] = useState('')
    const [options, setOptions] = useState(DEFAULT_OPTIONS)

    useEffect(() => {
        document.title = appTitle
        if (!logoUrl) return

        const favicon = document.querySelector("link[rel~='icon']")
        if (favicon) {
            favicon.href = logoUrl
            return
        }

        const newFavicon = document.createElement('link')
        newFavicon.rel = 'icon'
        newFavicon.href = logoUrl
        document.head.appendChild(newFavicon)
    }, [appTitle, logoUrl])

    const setOption = (key, value) => {
        setOptions((current) => ({ ...current, [key]: value }))
    }

    const setNestedOption = (section, key, value) => {
        setOptions((current) => ({
            ...current,
            [section]: {
                ...current[section],
                [key]: value,
            },
        }))
    }

    return (
        <Layout>
            <motion.div
                variants={pageMotion}
                initial="hidden"
                animate="show"
                className="flex flex-col-reverse gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]"
            >
                <motion.div variants={itemMotion} className="space-y-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                {logoUrl && (
                                    <img src={logoUrl} alt="Logo" className="h-12 w-12 rounded-lg object-contain" />
                                )}
                                <h1 className="text-4xl font-bold tracking-tight text-[#B0E4CC] sm:text-5xl">
                                    {appTitle}
                                </h1>
                            </div>
                            <p className="max-w-2xl text-sm font-medium text-[#B0E4CC]/75 sm:text-base">
                                Build detailed QR codes with editable colors, marker styles, logo treatment, scan margin, error correction, and export sizing.
                            </p>
                        </div>
                        <Button variant="outline" className="gap-2 self-start" onClick={() => setOptions(DEFAULT_OPTIONS)}>
                            <RotateCcw className="h-4 w-4" /> Reset
                        </Button>
                    </div>

                    <motion.div variants={itemMotion}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Content</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Destination URL</Label>
                                    <Input
                                        value={url}
                                        onChange={(event) => setUrl(event.target.value)}
                                        placeholder={defaultUrl}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>File Name</Label>
                                    <Input
                                        value={options.fileName}
                                        onChange={(event) => setOption('fileName', event.target.value)}
                                        placeholder="qrcode"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemMotion}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-8 xl:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="space-y-5">
                                        <div className="border-b border-[#408A71]/35 pb-3">
                                            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#B0E4CC]/70">
                                                Dots
                                            </h3>
                                        </div>
                                        <ColorPicker
                                            label="Dot Color"
                                            value={options.dotsOptions.color}
                                            onChange={(color) => setNestedOption('dotsOptions', 'color', color)}
                                        />
                                        <OptionSelector
                                            label="Dot Shape"
                                            value={options.dotsOptions.type}
                                            onChange={(type) => setNestedOption('dotsOptions', 'type', type)}
                                            options={DOT_SHAPES}
                                            columns="grid-cols-4"
                                        />
                                    </div>

                                    <div className="space-y-5 border-t border-[#408A71]/35 pt-6">
                                        <div className="border-b border-[#408A71]/35 pb-3">
                                            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#B0E4CC]/70">
                                                Canvas
                                            </h3>
                                        </div>
                                        <ColorPicker
                                            label="Background Color"
                                            value={options.backgroundOptions.color}
                                            onChange={(color) => setNestedOption('backgroundOptions', 'color', color)}
                                        />
                                        <SliderControl
                                            label="Quiet Zone"
                                            value={options.quietZone}
                                            onChange={(value) => setOption('quietZone', value)}
                                            min={8}
                                            max={80}
                                            step={4}
                                            suffix="px"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-5">
                                        <div className="border-b border-[#408A71]/35 pb-3">
                                            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#B0E4CC]/70">
                                                Finder Frame
                                            </h3>
                                        </div>
                                        <ColorPicker
                                            label="Frame Color"
                                            value={options.cornersSquareOptions.color}
                                            onChange={(color) => setNestedOption('cornersSquareOptions', 'color', color)}
                                        />
                                        <OptionSelector
                                            label="Frame Shape"
                                            value={options.cornersSquareOptions.type}
                                            onChange={(type) => setNestedOption('cornersSquareOptions', 'type', type)}
                                            options={EYE_FRAME_SHAPES}
                                            columns="grid-cols-3"
                                        />
                                    </div>

                                    <div className="space-y-5 border-t border-[#408A71]/35 pt-6">
                                        <div className="border-b border-[#408A71]/35 pb-3">
                                            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#B0E4CC]/70">
                                                Finder Center
                                            </h3>
                                        </div>
                                        <ColorPicker
                                            label="Center Color"
                                            value={options.cornersDotOptions.color}
                                            onChange={(color) => setNestedOption('cornersDotOptions', 'color', color)}
                                        />
                                        <OptionSelector
                                            label="Center Shape"
                                            value={options.cornersDotOptions.type}
                                            onChange={(type) => setNestedOption('cornersDotOptions', 'type', type)}
                                            options={EYE_CENTER_SHAPES}
                                            columns="grid-cols-4"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemMotion}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Logo & Output</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-8 xl:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="border-b border-[#408A71]/35 pb-3">
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#B0E4CC]/70">
                                            Logo
                                        </h3>
                                    </div>
                                    <LogoUpload
                                        label="Upload Image"
                                        value={options.image}
                                        onChange={(image) => setOption('image', image)}
                                    />
                                    <SliderControl
                                        label="Logo Size"
                                        value={options.logoSize}
                                        onChange={(value) => setOption('logoSize', value)}
                                        min={0}
                                        max={160}
                                        step={4}
                                        suffix="px"
                                    />
                                    <SliderControl
                                        label="Logo Opacity"
                                        value={options.logoOpacity}
                                        onChange={(value) => setOption('logoOpacity', value)}
                                        min={0}
                                        max={100}
                                        step={5}
                                        suffix="%"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="border-b border-[#408A71]/35 pb-3">
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#B0E4CC]/70">
                                            Export
                                        </h3>
                                    </div>
                                    <SliderControl
                                        label="Export Size"
                                        value={options.size}
                                        onChange={(value) => setOption('size', value)}
                                        min={256}
                                        max={1024}
                                        step={64}
                                        suffix="px"
                                    />
                                    <OptionSelector
                                        label="Error Correction"
                                        value={options.errorCorrectionLevel}
                                        onChange={(value) => setOption('errorCorrectionLevel', value)}
                                        options={ERROR_CORRECTION_OPTIONS}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <motion.div variants={itemMotion} className="relative">
                    <QRCodeGenerator
                        options={{
                            ...options,
                            data: url || defaultUrl,
                        }}
                    />
                </motion.div>
            </motion.div>
        </Layout>
    )
}

export default App
