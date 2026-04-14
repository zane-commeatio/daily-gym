export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Daily Gym
        </h1>
        <p className="max-w-md text-center text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Your workout recommender — what should you do today?
        </p>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Today&apos;s recommendation
          </span>
          <span className="text-2xl font-semibold text-black dark:text-zinc-50">
            Coming soon
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Log your first session to get started
          </span>
        </div>
      </main>
    </div>
  );
}
