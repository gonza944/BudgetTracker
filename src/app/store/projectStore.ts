"use client";

import { create } from 'zustand'
import { createNewExpense, Expense, ExpensesArray, getExpenses, getProject, ProjectBudgetTypes, removeExpense } from '../landing/dashboardActions'
import { getDateInScoreFormat, getFirstAndLastDayOfTheMonth } from '../landing/utils'
import { createNewExpenseSchema } from './schemas'

type StoreTypes = {
    projectName: string
    selectedExpensesDay: Date
    monthlyExpenses: ExpensesArray
    project: ProjectBudgetTypes
    totalRemainingBudget: number
    setProject: (projectName: string) => Promise<void>
    createNewExpense: (formData: FormData, expenseDate: Date, projectName: string) => void
    removeExpense: (projectName: string, expense: Expense) => void
    setMonthlyExpenses: (projectExpenses: string, firstDay: number, lastDay: number) => Promise<void>
    setNewSelectedExpensesDay: (newSelectedExpensesDay: Date) => void
}

export const useProjectStore = create<StoreTypes>((set) => ({
    projectName: 'project:viaje-europa-2024',
    selectedExpensesDay: new Date(),
    monthlyExpenses: [],
    project: {
        budget: 0,
        total_expenses: 0,
        dailyBudget: 0,
        projectName: '',
    },
    totalRemainingBudget: 0,
    setProject: async (projectName: string) => {
        const project = await getProject(projectName);
        set({ project, totalRemainingBudget: project.budget - project.total_expenses });
    },
    createNewExpense: async (formData, expenseDate, projectName) => {
        const rawFormData = createNewExpenseSchema.parse({
            description: formData.get("description") as string,
            category: formData.get("category") as string,
            amount: formData.get("amount"),
        });
        const newExpense = await createNewExpense(rawFormData, expenseDate, projectName)
        if (newExpense.success) {
            set((state) => ({
                monthlyExpenses: [newExpense.data, ...state.monthlyExpenses]
            }))
        }
    },
    removeExpense: async (projectName, expense) => {
        await removeExpense(expense, projectName);
        set((state) => ({
            monthlyExpenses: state.monthlyExpenses.filter((e) => e.index !== expense.index)
        }))
    },
    setMonthlyExpenses: async (projectExpenses: string, firstDay: number, lastDay: number) => {
        const expenses = await getExpenses(projectExpenses, firstDay, lastDay);
        set({ monthlyExpenses: expenses });
    },
    setNewSelectedExpensesDay: (newSelectedExpensesDay: Date) => {
        set({ selectedExpensesDay: newSelectedExpensesDay })
    },
}))

const getExpensesForADay = ({ selectedExpensesDay, monthlyExpenses }: StoreTypes) => {
    const selectedDateInScoreFormat = getDateInScoreFormat(selectedExpensesDay)
    return monthlyExpenses.filter((expense) => expense.index.includes(selectedDateInScoreFormat.toString().substring(0, 8))
    )
}

export const dailyRemainingBudget = (state: StoreTypes) => {
    const expenses = getExpensesForADay(state);
    const dailyExpenses = expenses.reduce(
        (acc, expense) => acc + Number.parseFloat(expense.amount as string),
        0
    );
    return state.project.dailyBudget! - dailyExpenses;
}

export const monthlyBudget = ({ project, monthlyExpenses }: StoreTypes) => {
    const totalExpenses = monthlyExpenses.reduce(
        (acc, expense) => acc + Number.parseFloat(expense.amount as string),
        0
    );
    return project?.dailyBudget! * 30 - totalExpenses;
}

export const getSelectedMonthExpensesGroupedByCategory = (state: StoreTypes) => {
    const categoriesAndAmountMap = state.monthlyExpenses.reduce((acc, expense) => {
        const category = acc.get(expense.category);

        if (category) {
            acc.set(
                expense.category,
                category + Number.parseFloat(`${expense.amount}`)
            );
        } else {
            acc.set(
                expense.category,
                Number.parseFloat(`${expense.amount}`)
            );
        }

        return acc;
    }, new Map<string, number>())

    return Array.from(categoriesAndAmountMap).map(([name, amount]) => ({
        name,
        amount,
    }))
};

export const getSelectedMonthExpensesGroupedByDay = (state: StoreTypes) => {
    const { monthlyExpenses, selectedExpensesDay } = state;
    const { firstDay, lastDay } = getFirstAndLastDayOfTheMonth(selectedExpensesDay.getMonth());

    const daysInMonth = lastDay.getDate();
    let remainingBudget = monthlyBudget(state);

    const datesArray = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), i + 1);
        return { name: date.toLocaleDateString(), date };
    });

    const chartData = monthlyExpenses.reduce(
        (acc, expense) => {
            const dateInStringFormat = expense.index.substring(8, 16);
            const expenseKey = Number.parseInt(
                dateInStringFormat.substring(6, 8)
            );
            const correspondingData = acc[expenseKey];
            remainingBudget -= Number.parseFloat(expense.amount as string);
            correspondingData.remainingBudget = remainingBudget;

            return acc;
        },
        [
            {
                name: "",
                remainingBudget: monthlyBudget,
                controlBudget: monthlyBudget,
            },
            ...datesArray,
        ] as {
            name: string;
            remainingBudget: number;
            controlBudget: number;
            date?: Date;
        }[]
    )
    chartData[chartData.length - 1].controlBudget = 0;
    return chartData;
};