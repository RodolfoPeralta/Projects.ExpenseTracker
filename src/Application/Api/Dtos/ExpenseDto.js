class ExpenseDto {

    constructor(expense) {
        this.id = expense._id,
        this.amount = expense.amount,
        this.category = expense.category,
        this.description = expense.description,
        this.date = expense.date,
        this.user_id = expense.user
    }
}

export default ExpenseDto;