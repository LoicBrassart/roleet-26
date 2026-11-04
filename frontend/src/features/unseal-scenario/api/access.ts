const storageKey = "unsealedScenarios";

export async function getUnsealedScenarioIds(): Promise<number[]> {
  try {
    const scenarios = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(scenarios)) throw new Error();
    if (!scenarios.every((scen) => typeof scen === "number")) throw new Error();
    return scenarios;
  } catch {
    return [];
  }
}
export async function unsealScenario(id: number) {
  const oldSeals = await getUnsealedScenarioIds();
  const newSeals = [...new Set([...oldSeals, id])];
  localStorage.setItem(storageKey, JSON.stringify(newSeals));
}
