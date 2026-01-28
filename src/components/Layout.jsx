import React from 'react'

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen relative w-full overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-blue-500/30">
            {/* Background Mesh Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-black" />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-10 max-w-7xl">
                {children}
            </main>
        </div>
    )
}
