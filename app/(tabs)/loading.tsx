export default function Loading() {
  return (
    <div className="flex space-x-2 justify-center items-center bg-white mt-40 dark:invert">
      <div className="h-4 w-4 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 bg-gray-700 rounded-full animate-bounce"></div>
    </div>
  );
}
