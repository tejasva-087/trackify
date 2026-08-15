interface DividerProps {
  text?: string;
}

export default function Divider({ text = "or" }: DividerProps) {
  return (
    <div className="relative flex items-center py-5">
      <div className="grow border-t border-gray-300"></div>

      {text && (
        <span className="mx-4 shrink text-xs text-gray-500 uppercase tracking-wider">
          {text}
        </span>
      )}

      <div className="grow border-t border-gray-300"></div>
    </div>
  );
}
