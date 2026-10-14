import { Sun, Moon } from 'lucide-react'

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      onClick={() =>
        setTheme((current) =>
          current === 'dark' ? 'light' : 'dark'
        )
      }
      aria-label={`Switch to ${
        theme === 'dark' ? 'light' : 'dark'
      } mode`}
      title={`Switch to ${
        theme === 'dark' ? 'light' : 'dark'
      } mode`}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-gray-300 transition hover:bg-white/10"
    >
      {theme === 'dark' ? (
        <Sun size={19} />
      ) : (
        <Moon size={19} />
      )}
    </button>
  )
}

export default ThemeToggle