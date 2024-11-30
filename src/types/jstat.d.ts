declare module "jstat" {
	export interface JStat {
		beta: {
			sample(alpha: number, beta: number): number;
		};
		uniform: {
			sample(min: number, max: number): number;
		};
	}

	const jstat: JStat;
	export default jstat;
}
