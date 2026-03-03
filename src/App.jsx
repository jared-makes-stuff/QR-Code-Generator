import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layout } from './components/Layout'
import { QRCodeGenerator } from './components/QRCodeGenerator'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card'
import { Input } from './components/ui/Input'
import { ColorPicker } from './components/Controls/ColorPicker'
import { ShapeSelector } from './components/Controls/ShapeSelector'
import { LogoUpload } from './components/Controls/LogoUpload'



function App() {
    const defaultUrl = import.meta.env.VITE_DEFAULT_URL || "https://github.com/Jared0024/QR-Code-Generator-Website";
    const appTitle = import.meta.env.VITE_APP_TITLE || "QR Studio";
    const logoUrl = import.meta.env.VITE_LOGO_URL;

    // Update Favicon and Title
    useState(() => {
        document.title = appTitle;
        if (logoUrl) {
            const link = document.querySelector("link[rel~='icon']");
            if (link) {
                link.href = logoUrl;
            } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = logoUrl;
                document.head.appendChild(newLink);
            }
        }
    }, [appTitle, logoUrl]);

    const [url, setUrl] = useState("");
    const [options, setOptions] = useState({
        dotsOptions: { color: "#000000", type: "rounded" },
        backgroundOptions: { color: "#ffffff" },
        cornersSquareOptions: { type: "extra-rounded", color: "#000000" },
        cornersDotOptions: { type: "dot", color: "#000000" },
        image: "",
    });

    const updateOption = (section, key, value) => {
        setOptions(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    }

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-12 gap-8"
            >
                {/* Left: Controls */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {logoUrl && (
                                <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
                            )}
                            <h1 className="text-4xl font-bold text-white tracking-tight">
                                {appTitle}
                            </h1>
                        </div>
                        <p className="text-slate-400">Create minimal, custom QR codes.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300">
                                    Destination URL
                                </label>
                                <Input
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter your URL here..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dots</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <ColorPicker
                                    label="Color"
                                    value={options.dotsOptions.color}
                                    onChange={(c) => updateOption('dotsOptions', 'color', c)}
                                />
                                <ShapeSelector
                                    label="Style"
                                    value={options.dotsOptions.type}
                                    onChange={(t) => updateOption('dotsOptions', 'type', t)}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Corners</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <ColorPicker
                                    label="Eye Frame Color"
                                    value={options.cornersSquareOptions.color}
                                    onChange={(c) => updateOption('cornersSquareOptions', 'color', c)}
                                />
                                <ColorPicker
                                    label="Eye Center Color"
                                    value={options.cornersDotOptions.color}
                                    onChange={(c) => updateOption('cornersDotOptions', 'color', c)}
                                />
                                <ShapeSelector
                                    label="Corner Shape"
                                    value={options.cornersSquareOptions.type}
                                    onChange={(t) => updateOption('cornersSquareOptions', 'type', t)}
                                    options={[
                                        { id: 'square', label: 'Square' },
                                        { id: 'extra-rounded', label: 'Rounded' },
                                        { id: 'dot', label: 'Circle' },
                                    ]}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Background</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <ColorPicker
                                    label="Color"
                                    value={options.backgroundOptions.color}
                                    onChange={(c) => updateOption('backgroundOptions', 'color', c)}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Logo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LogoUpload
                                    label="Upload Image"
                                    value={options.image}
                                    onChange={(img) => setOptions(prev => ({ ...prev, image: img }))}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="lg:col-span-5 relative">
                    <QRCodeGenerator
                        options={{
                            ...options,
                            data: url || defaultUrl
                        }}
                    />
                </div>
            </motion.div>
        </Layout>
    )
}

export default App
