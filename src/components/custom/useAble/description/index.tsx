interface DescriptionProps {
  text: string;
}
function Description({ text }: DescriptionProps) {
  return (
    <div className="w-full flex items-center justify-center bg-slate-400 h-[70px] relative group">
      {text}
    </div>
  );
}

export default Description;
