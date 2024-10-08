export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className={`flex items-center justify-center px-6 md:px-10`}>
        <div className="mx-auto block w-full">{children}</div>
      </div>
    </div>
  );
}
