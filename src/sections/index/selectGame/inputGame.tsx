interface Props {
  placeholder?: string;
}

export default function InputGame({ placeholder }: Props) {
  return (
    <textarea
      id="pgn"
      className="white"
      cols={30}
      rows={10}
      spellCheck="false"
      placeholder={placeholder}
    />
  );
}
