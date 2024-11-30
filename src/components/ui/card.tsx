interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
	return <div className={`bg-white rounded-lg border border-slate-200 p-4 ${className}`}>{children}</div>;
}
