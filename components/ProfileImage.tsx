export default function ProfileImage() {
  return (
    <div className="flex justify-center">
      <div className="relative h-64 w-64 overflow-hidden rounded-2xl bg-zinc-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-6xl">📸</div>
            <p className="text-sm text-zinc-500">Sua foto aqui</p>
          </div>
        </div>
      </div>
    </div>
  );
}
