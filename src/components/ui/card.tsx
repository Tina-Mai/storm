interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
	return <div className={`vertical bg-white rounded-lg border border-slate-200 p-4 gap-1 ${className}`}>{children}</div>;
}
