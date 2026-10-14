
function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-black">
            PRESS<span className="text-orange-400">LY.</span>
          </p>

          <p className="mt-1 text-xs text-gray-500">
            A clearer view of the world.
          </p>
        </div>

        <p className="text-xs leading-5 text-gray-600">
          Learning project · Demo content, not live headlines
        </p>
      </div>
    </footer>
  )
}

export default Footer
