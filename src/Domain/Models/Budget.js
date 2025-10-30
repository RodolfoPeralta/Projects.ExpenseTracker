class Budget {

    constructor(budget = {}) {

        return {
            amount: budget.amount ?? null,
            status: budget.status ?? "unknown",
            month: budget.month ?? null
        }
    }
}

export default Budget;