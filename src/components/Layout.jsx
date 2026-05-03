export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#091413] text-[#B0E4CC] selection:bg-[#B0E4CC] selection:text-[#091413]">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
                {children}
            </main>
        </div>
    )
}
