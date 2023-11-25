import { createSelector } from "@reduxjs/toolkit";


export const createCustomSelector = (deps, func) => {

	const selector = createSelector(deps, func);

	selector.from = (state) => {
		if (!Array.isArray(deps)) deps = [deps];
		let resultados = deps.map(s => s(state))
		return func(...resultados)
	}
	return selector;
}