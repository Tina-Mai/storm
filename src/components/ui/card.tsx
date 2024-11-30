const Card = ({ children }: { children: React.ReactNode }) => {
	return <div className="vertical p-4 bg-white border border-slate-200/70 rounded-md shadow-sm gap-3">{children}</div>;
};

export default Card;
