<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
    DollarSign, TrendingUp, Target, PlusCircle, Utensils, Home, ShoppingCart, Film, Bus
} from 'lucide-vue-next'
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar'; // Use PrimeVue ProgressBar
import DataTable from 'primevue/datatable'; // Use PrimeVue DataTable
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'; // Use PrimeVue InputText
import Dropdown from 'primevue/dropdown'; // Use PrimeVue Dropdown
import InputNumber from 'primevue/inputnumber'; // Use PrimeVue InputNumber
import SelectButton from 'primevue/selectbutton'; // For Type selection
import { useToast } from 'primevue/usetoast';
import { Bar, Pie } from 'vue-chartjs' // Import vue-chartjs components
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)


// Define types (consider moving to a separate types file)
type Transaction = {
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string; // ISO string format
};

type BudgetGoal = {
    id: string;
    category: string;
    limit: number;
};

// --- Reactive State ---
const toast = useToast();

// Dummy Data (Use reactive refs)
const initialTransactions: Transaction[] = [
    { id: '1', type: 'income', category: 'Salary', amount: 3500, date: '2024-07-01T10:00:00Z' },
    { id: '2', type: 'expense', category: 'Groceries', amount: 150, date: '2024-07-05T15:30:00Z' },
    { id: '3', type: 'expense', category: 'Rent', amount: 1200, date: '2024-07-02T08:00:00Z' },
    { id: '4', type: 'expense', category: 'Entertainment', amount: 75, date: '2024-07-10T20:15:00Z' },
    { id: '5', type: 'expense', category: 'Transport', amount: 50, date: '2024-07-08T07:45:00Z' },
    { id: '6', type: 'income', category: 'Freelance', amount: 500, date: '2024-07-15T11:00:00Z' },
    { id: '7', type: 'expense', category: 'Groceries', amount: 80, date: '2024-07-18T16:00:00Z' },
    { id: '8', type: 'expense', category: 'Entertainment', amount: 40, date: '2024-07-22T19:30:00Z' },
];

const initialBudgetGoals: BudgetGoal[] = [
    { id: 'b1', category: 'Groceries', limit: 400 },
    { id: 'b2', category: 'Entertainment', limit: 200 },
    { id: 'b3', category: 'Transport', limit: 100 },
    { id: 'b4', category: 'Rent', limit: 1200 },
];

const transactions = ref<Transaction[]>(initialTransactions);
const budgetGoals = ref<BudgetGoal[]>(initialBudgetGoals);

// Dialog states
const isTransactionDialogVisible = ref(false);
const isGoalDialogVisible = ref(false);

// Form states (using reactive for grouping related form fields)
const newTransactionForm = reactive({
    type: { name: 'Expense', value: 'expense' } as { name: string, value: 'income' | 'expense' }, // For SelectButton
    category: null as { name: string, code: string, icon: any } | null,
    amount: null as number | null,
});

const newGoalForm = reactive({
    category: null as { name: string, code: string, icon: any } | null,
    limit: null as number | null
});


// --- Categories ---
// Prepare categories for PrimeVue Dropdown format
const expenseCategories = [
    { name: 'Groceries', code: 'Groceries', icon: Utensils },
    { name: 'Rent', code: 'Rent', icon: Home },
    { name: 'Shopping', code: 'Shopping', icon: ShoppingCart },
    { name: 'Entertainment', code: 'Entertainment', icon: Film },
    { name: 'Transport', code: 'Transport', icon: Bus },
    { name: 'Other', code: 'Other', icon: DollarSign },
];

const incomeCategories = [
    { name: 'Salary', code: 'Salary', icon: DollarSign },
    { name: 'Freelance', code: 'Freelance', icon: DollarSign },
    { name: 'Investment', code: 'Investment', icon: TrendingUp },
    { name: 'Other', code: 'Other', icon: DollarSign },
];

const transactionTypeOptions = ref([ // For SelectButton
    { name: 'Expense', value: 'expense' },
    { name: 'Income', value: 'income' }
]);

const currentCategoryOptions = computed(() => {
    return newTransactionForm.type.value === 'expense' ? expenseCategories : incomeCategories;
});

const allCategoriesMap = computed(() => {
     const map = new Map<string, any>();
     [...expenseCategories, ...incomeCategories].forEach(cat => map.set(cat.code, cat));
     return map;
});

// --- Computed Properties ---
const totalIncome = computed(() => {
    return transactions.value
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpenses = computed(() => {
    return transactions.value
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
});

const netBalance = computed(() => totalIncome.value - totalExpenses.value);

const expensesByCategory = computed(() => {
    const expensesMap = new Map<string, number>();
    transactions.value
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
            expensesMap.set(t.category, (expensesMap.get(t.category) || 0) + t.amount);
        });
    return Array.from(expensesMap, ([category, amount]) => ({ category, amount }));
});

const incomeExpenseData = computed(() => {
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });

    transactions.value.forEach(t => {
        // Simple grouping by current month - adjust if needed for more complex grouping
        const data = monthlyData.get(currentMonth) ?? { income: 0, expenses: 0 };
        if (t.type === 'income') data.income += t.amount;
        else data.expenses += t.amount;
        monthlyData.set(currentMonth, data);
    });

    // Add dummy past data for chart visualization
    if (!monthlyData.has('Jun')) monthlyData.set('Jun', {income: 3800, expenses: 1800});
    if (!monthlyData.has('May')) monthlyData.set('May', {income: 3600, expenses: 1950});


    const sortedData = Array.from(monthlyData, ([month, data]) => ({ month, ...data })).sort((a, b) => {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    return {
        labels: sortedData.map(d => d.month),
        datasets: [
            {
                label: 'Income',
                backgroundColor: 'hsl(var(--chart-2))', // Soft Green
                data: sortedData.map(d => d.income),
                borderRadius: 4,
            },
            {
                label: 'Expenses',
                backgroundColor: 'hsl(var(--chart-1))', // Teal
                data: sortedData.map(d => d.expenses),
                borderRadius: 4,
            }
        ]
    };
});

const expenseDistributionData = computed(() => {
    const labels = expensesByCategory.value.map(e => e.category);
    const data = expensesByCategory.value.map(e => e.amount);
    const backgroundColors = labels.map(label =>
        `hsl(var(--chart-${getChartColorIndex(label)}))` || 'hsl(var(--muted))' // Fallback color
    );

    return {
        labels: labels,
        datasets: [
            {
                backgroundColor: backgroundColors,
                data: data,
            }
        ]
    };
});

const barChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false, // Title is in Card Header
        },
        tooltip: { // Customize tooltips if needed
             callbacks: {
                label: function(context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += formatCurrency(context.parsed.y);
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false // Hide vertical grid lines
            },
             ticks: {
                 color: 'hsl(var(--muted-foreground))'
             }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'hsl(var(--border))' // Use border color for horizontal lines
            },
            ticks: {
                 color: 'hsl(var(--muted-foreground))',
                 callback: function(value: number | string) { // Format Y-axis labels as currency
                    if (typeof value === 'number') {
                         return formatCurrency(value);
                    }
                    return value;
                }
             }
        }
    }
});

const pieChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom', // Position legend at the bottom
             labels: {
                 color: 'hsl(var(--foreground))', // Use foreground color for labels
                 usePointStyle: true, // Use point style for legend items
                 padding: 20 // Add padding
            }
        },
         title: {
            display: false, // Title is in Card Header
        },
        tooltip: {
            callbacks: {
                label: function(context: any) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed !== null) {
                        label += formatCurrency(context.parsed);
                    }
                    return label;
                }
            }
        }
    }
});


// --- Methods ---
const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return '';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getCategoryIcon = (category: string): any => {
   return allCategoriesMap.value.get(category)?.icon || DollarSign;
};

// Helper to map category to chart color index
const getChartColorIndex = (category: string): number => {
    const categoryMap: { [key: string]: number } = {
        'Groceries': 1,
        'Rent': 2,
        'Entertainment': 3,
        'Transport': 4,
        'Shopping': 5,
    };
    return categoryMap[category] || 3; // Default to chart-3 if not found
};


const openTransactionDialog = () => {
    resetTransactionForm();
    isTransactionDialogVisible.value = true;
};

const openGoalDialog = () => {
    resetGoalForm();
    isGoalDialogVisible.value = true;
};

const resetTransactionForm = () => {
    newTransactionForm.type = { name: 'Expense', value: 'expense' };
    newTransactionForm.category = null;
    newTransactionForm.amount = null;
};

const resetGoalForm = () => {
    newGoalForm.category = null;
    newGoalForm.limit = null;
};

const handleAddTransaction = () => {
    const amount = newTransactionForm.amount;
    const category = newTransactionForm.category?.code; // Get code from Dropdown object

    if (!category || amount === null || amount <= 0) {
        toast.add({ severity: 'error', summary: 'Invalid Input', detail: 'Please select a category and enter a valid positive amount.', life: 3000 });
        return;
    }

    const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: newTransactionForm.type.value,
        category: category,
        amount: amount,
        date: new Date().toISOString(),
    };

    transactions.value.push(newTransaction); // Use .push for refs
    toast.add({ severity: 'success', summary: 'Transaction Added', detail: `${formatCurrency(amount)} ${newTransactionForm.type.value} recorded for ${category}.`, life: 3000 });

    isTransactionDialogVisible.value = false; // Close dialog
};

const handleAddBudgetGoal = () => {
    const limit = newGoalForm.limit;
    const category = newGoalForm.category?.code;

    if (!category || limit === null || limit <= 0) {
         toast.add({ severity: 'error', summary: 'Invalid Input', detail: 'Please select a category and enter a valid positive limit.', life: 3000 });
        return;
    }

    const existingGoalIndex = budgetGoals.value.findIndex(g => g.category === category);

    if (existingGoalIndex > -1) {
        budgetGoals.value[existingGoalIndex].limit = limit; // Update existing goal
         toast.add({ severity: 'info', summary: 'Budget Goal Updated', detail: `Budget for ${category} set to ${formatCurrency(limit)}.`, life: 3000 });
    } else {
        const newGoal: BudgetGoal = {
            id: crypto.randomUUID(),
            category: category,
            limit: limit,
        };
        budgetGoals.value.push(newGoal); // Add new goal
         toast.add({ severity: 'success', summary: 'Budget Goal Added', detail: `Budget for ${category} set to ${formatCurrency(limit)}.`, life: 3000 });
    }

    isGoalDialogVisible.value = false; // Close dialog
};

const getSpentAmount = (category: string): number => {
    return transactions.value
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
};

const calculateProgress = (spent: number, limit: number): number => {
    if (limit <= 0) return 0;
    return Math.min((spent / limit) * 100, 100);
};

const getProgressColor = (progress: number): string => {
    if (progress >= 100) return 'bg-destructive'; // Red
    if (progress > 75) return 'bg-orange-500'; // Orange - using Tailwind directly here for simplicity
    return 'bg-accent'; // Accent color (soft green)
}

const getRemainingText = (spent: number, limit: number): string => {
     const remaining = limit - spent;
      return remaining >= 0
        ? `${formatCurrency(remaining)} remaining`
        : `${formatCurrency(Math.abs(remaining))} over budget`;
}

const getRemainingClass = (spent: number, limit: number): string => {
     const remaining = limit - spent;
     return remaining >= 0 ? 'text-muted-foreground' : 'text-destructive font-medium';
}

// Computed property for sorted, sliced transactions for the table
const recentTransactions = computed(() => {
    return transactions.value
        .slice() // Create a copy to sort
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort newest first
        .slice(0, 5); // Show latest 5
});

</script>

<template>
    <div class="w-full max-w-6xl space-y-6">
        <header class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-primary">BudgetFlow Dashboard</h1>
            <div class="flex gap-2">
                <Button @click="openTransactionDialog">
                    <PlusCircle class="mr-2 h-4 w-4" /> Add Transaction
                </Button>
                <Button @click="openGoalDialog" outlined> <!-- Use outlined style -->
                    <Target class="mr-2 h-4 w-4" /> Set Budget Goal
                </Button>
            </div>
        </header>

        <!-- Key Insights -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                 <template #title>
                    <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span class="text-sm font-medium">Total Income</span>
                        <DollarSign class="h-4 w-4 text-muted-foreground" />
                    </div>
                </template>
                <template #content>
                    <div class="text-2xl font-bold text-[hsl(120,60%,40%)]">{{ formatCurrency(totalIncome) }}</div>
                    <p class="text-xs text-muted-foreground">This month</p>
                </template>
            </Card>
             <Card>
                 <template #title>
                    <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span class="text-sm font-medium">Total Expenses</span>
                        <DollarSign class="h-4 w-4 text-muted-foreground" />
                    </div>
                 </template>
                <template #content>
                    <div class="text-2xl font-bold text-[hsl(0,70%,50%)]">{{ formatCurrency(totalExpenses) }}</div>
                    <p class="text-xs text-muted-foreground">This month</p>
                </template>
            </Card>
            <Card>
                 <template #title>
                    <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span class="text-sm font-medium">Net Balance</span>
                         <TrendingUp class="h-4 w-4 text-muted-foreground" />
                    </div>
                 </template>
                <template #content>
                     <div :class="['text-2xl font-bold', netBalance >= 0 ? 'text-accent-foreground' : 'text-destructive']">{{ formatCurrency(netBalance) }}</div>
                    <p class="text-xs text-muted-foreground">Remaining balance</p>
                </template>
            </Card>
        </section>

         <!-- Charts -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
             <Card>
                 <template #title>Income vs. Expenses</template>
                 <template #subtitle>Monthly comparison</template>
                <template #content>
                    <div class="h-[250px] w-full">
                        <Bar :data="incomeExpenseData" :options="barChartOptions" />
                    </div>
                </template>
            </Card>
             <Card>
                 <template #title>Expense Distribution</template>
                 <template #subtitle>Spending by category this month</template>
                <template #content>
                    <div class="h-[250px] w-full flex items-center justify-center">
                         <Pie :data="expenseDistributionData" :options="pieChartOptions" class="mx-auto aspect-square max-h-[250px]" />
                    </div>
                </template>
            </Card>
        </section>

        <!-- Budget Goals -->
        <section>
            <Card>
                 <template #title>Budget Goals</template>
                 <template #subtitle>Track your spending against your set limits.</template>
                <template #content class="space-y-4">
                     <p v-if="budgetGoals.length === 0" class="text-muted-foreground text-center">
                        No budget goals set yet. Click 'Set Budget Goal' to add one.
                    </p>
                    <div v-for="goal in budgetGoals" :key="goal.id" class="space-y-1">
                        <div class="flex justify-between items-center text-sm font-medium">
                            <span class="flex items-center gap-2">
                                <component :is="getCategoryIcon(goal.category)" class="h-4 w-4 text-muted-foreground" />
                                {{ goal.category }}
                            </span>
                            <span>{{ formatCurrency(getSpentAmount(goal.category)) }} / {{ formatCurrency(goal.limit) }}</span>
                        </div>
                         <!-- Use PrimeVue ProgressBar -->
                         <ProgressBar :value="calculateProgress(getSpentAmount(goal.category), goal.limit)" :showValue="false"
                                     :pt="{ value: { class: getProgressColor(calculateProgress(getSpentAmount(goal.category), goal.limit)) } }">
                         </ProgressBar>
                          <p :class="['text-xs', getRemainingClass(getSpentAmount(goal.category), goal.limit)]">
                            {{ getRemainingText(getSpentAmount(goal.category), goal.limit) }}
                         </p>
                    </div>
                </template>
            </Card>
        </section>

        <!-- Recent Transactions -->
       <section>
            <Card>
                 <template #title>Recent Transactions</template>
                 <template #subtitle>Your latest income and expenses.</template>
                <template #content>
                    <DataTable :value="recentTransactions" tableStyle="min-width: 50rem" size="small">
                         <template #empty>
                            <div class="text-center text-muted-foreground p-4">No transactions yet.</div>
                         </template>
                        <Column field="type" header="Type">
                             <template #body="slotProps">
                                <span :class="['capitalize', slotProps.data.type === 'income' ? 'text-[hsl(120,60%,40%)]' : 'text-[hsl(0,70%,50%)]']">
                                    {{ slotProps.data.type }}
                                </span>
                            </template>
                        </Column>
                         <Column field="category" header="Category">
                             <template #body="slotProps">
                                <span class="flex items-center gap-2">
                                    <component :is="getCategoryIcon(slotProps.data.category)" class="h-4 w-4 text-muted-foreground" />
                                    {{ slotProps.data.category }}
                                </span>
                            </template>
                         </Column>
                         <Column field="date" header="Date">
                            <template #body="slotProps">
                                {{ new Date(slotProps.data.date).toLocaleDateString() }}
                            </template>
                         </Column>
                         <Column field="amount" header="Amount" headerClass="text-right" bodyClass="text-right">
                              <template #body="slotProps">
                                 <span :class="['font-semibold', slotProps.data.type === 'income' ? 'text-[hsl(120,60%,40%)]' : 'text-[hsl(0,70%,50%)]']">
                                    {{ slotProps.data.type === 'income' ? '+' : '-' }}
                                    {{ formatCurrency(slotProps.data.amount) }}
                                </span>
                            </template>
                         </Column>
                    </DataTable>
                </template>
                 <template #footer v-if="transactions.length > 5">
                    <div class="flex justify-center">
                        <!-- Placeholder for "View All" - can link to another page/component -->
                        <Button label="View All Transactions" link size="small" />
                    </div>
                 </template>
            </Card>
        </section>

         <!-- Add Transaction Dialog -->
        <Dialog v-model:visible="isTransactionDialogVisible" modal header="Add New Transaction" :style="{ width: '25rem' }" @hide="resetTransactionForm">
            <p class="mb-4 text-muted-foreground text-sm">Record your income or expense. Click save when you're done.</p>
             <div class="flex flex-col gap-4 py-4">
                 <div class="flex flex-col gap-2">
                    <label for="type" class="text-sm font-medium">Type</label>
                    <!-- Use SelectButton for Type -->
                    <SelectButton v-model="newTransactionForm.type" :options="transactionTypeOptions" optionLabel="name" dataKey="value" aria-labelledby="transaction-type"/>
                 </div>
                 <div class="flex flex-col gap-2">
                    <label for="category" class="text-sm font-medium">Category</label>
                    <!-- Use Dropdown for Category -->
                    <Dropdown v-model="newTransactionForm.category" :options="currentCategoryOptions" optionLabel="name" placeholder="Select category" class="w-full" filter>
                        <template #value="slotProps">
                             <div v-if="slotProps.value" class="flex items-center gap-2">
                                <component :is="slotProps.value.icon" class="h-4 w-4 text-muted-foreground" />
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                             <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                         <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <component :is="slotProps.option.icon" class="h-4 w-4 text-muted-foreground" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Dropdown>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="amount" class="text-sm font-medium">Amount ($)</label>
                    <!-- Use InputNumber for Amount -->
                     <InputNumber v-model="newTransactionForm.amount" inputId="amount" mode="currency" currency="USD" locale="en-US" placeholder="e.g., 50.00" :min="0.01" :minFractionDigits="2" :maxFractionDigits="2" class="w-full" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" severity="secondary" @click="isTransactionDialogVisible = false" />
                <Button label="Save Transaction" @click="handleAddTransaction" />
            </template>
        </Dialog>

         <!-- Add Budget Goal Dialog -->
        <Dialog v-model:visible="isGoalDialogVisible" modal header="Set Budget Goal" :style="{ width: '25rem' }" @hide="resetGoalForm">
             <p class="mb-4 text-muted-foreground text-sm">Set a spending limit for a specific category.</p>
             <div class="flex flex-col gap-4 py-4">
                 <div class="flex flex-col gap-2">
                     <label for="goal-category" class="text-sm font-medium">Category</label>
                    <Dropdown v-model="newGoalForm.category" :options="expenseCategories" optionLabel="name" placeholder="Select category" class="w-full" filter>
                         <template #value="slotProps">
                             <div v-if="slotProps.value" class="flex items-center gap-2">
                                <component :is="slotProps.value.icon" class="h-4 w-4 text-muted-foreground" />
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                             <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                         <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <component :is="slotProps.option.icon" class="h-4 w-4 text-muted-foreground" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Dropdown>
                 </div>
                 <div class="flex flex-col gap-2">
                    <label for="goal-limit" class="text-sm font-medium">Limit ($)</label>
                    <InputNumber v-model="newGoalForm.limit" inputId="goal-limit" mode="currency" currency="USD" locale="en-US" placeholder="e.g., 400.00" :min="0.01" :minFractionDigits="2" :maxFractionDigits="2" class="w-full" />
                 </div>
            </div>
            <template #footer>
                <Button label="Cancel" severity="secondary" @click="isGoalDialogVisible = false" />
                <Button label="Save Goal" @click="handleAddBudgetGoal" />
            </template>
        </Dialog>

    </div>
</template>

<style>
/* Add component-specific styles or overrides here */
/* Example: Adjust ProgressBar height */
.p-progressbar {
    height: 1rem; /* Match ShadCN progress height */
}

/* Style chart containers */
.chart-container {
    position: relative;
    height: 250px;
    width: 100%;
}
/* Style PrimeVue DataTable to look more like Shadcn Table */
.p-datatable .p-datatable-thead > tr > th {
    @apply h-12 px-4 text-left align-middle font-medium text-muted-foreground border-b bg-card; /* Match Shadcn TableHead */
     border-bottom-width: 1px;
     border-color: hsl(var(--border));
}

.p-datatable .p-datatable-tbody > tr {
     @apply border-b transition-colors hover:bg-muted/50; /* Match Shadcn TableRow */
     border-bottom-width: 1px;
     border-color: hsl(var(--border));
     background-color: hsl(var(--card)); /* Use card background */
}
.p-datatable .p-datatable-tbody > tr:last-child {
    border-bottom-width: 0;
}

.p-datatable .p-datatable-tbody > tr > td {
    @apply p-4 align-middle; /* Match Shadcn TableCell */
    color: hsl(var(--card-foreground));
}

.p-datatable .p-datatable-tbody > tr:hover {
    background-color: hsl(var(--muted) / 0.5); /* Match Shadcn hover */
}

.p-paginator {
     @apply bg-card text-card-foreground border-t;
     border-color: hsl(var(--border));
}

/* Adjust Card styling */
.p-card {
     @apply rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden; /* Match Shadcn Card */
}
.p-card .p-card-title {
     @apply text-lg font-semibold leading-none tracking-tight; /* Adjusted size */
     padding-bottom: 0.5rem; /* Add some space below title */

}
.p-card .p-card-subtitle {
    @apply text-sm text-muted-foreground mb-2; /* Match Shadcn CardDescription */
     margin-top: -0.25rem; /* Pull subtitle closer to title */

}
.p-card .p-card-content {
    @apply p-4 pt-0; /* Match Shadcn CardContent padding */
}
 .p-card .p-card-header {
    @apply p-4 pb-0; /* Match Shadcn CardHeader padding */
}
.p-card .p-card-footer {
     @apply p-4 pt-0; /* Match Shadcn CardFooter padding */
}


/* Adjust Button styling */
.p-button {
    @apply inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
    @apply h-10 px-4 py-2; /* Default size */
}
.p-button.p-button-primary {
     @apply bg-primary text-primary-foreground hover:bg-primary/90;
}
.p-button.p-button-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
}
.p-button.p-button-outlined {
     @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground;
}
.p-button.p-button-link {
     @apply text-primary underline-offset-4 hover:underline p-0 h-auto;
}
.p-button.p-button-sm {
    @apply h-9 rounded-md px-3;
}
.p-button .p-button-icon-left {
    margin-right: 0.5rem; /* Spacing between icon and text */
}


/* Adjust InputText, InputNumber, Dropdown */
.p-inputtext, .p-inputnumber .p-inputtext, .p-dropdown {
     @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}
.p-dropdown .p-dropdown-label.p-placeholder {
    @apply text-muted-foreground;
}
.p-dropdown-panel {
     @apply bg-popover text-popover-foreground border border-border rounded-md shadow-md;
}
.p-dropdown-item {
    @apply text-sm hover:bg-accent hover:text-accent-foreground;
}
.p-dropdown-item.p-focus {
    @apply bg-accent text-accent-foreground;
}
.p-dropdown-filter-container .p-inputtext {
    @apply h-8; /* Smaller filter input */
}

/* Adjust Dialog */
.p-dialog .p-dialog-header {
    @apply border-b border-border p-4 text-lg font-semibold; /* Adjust header padding */
}
.p-dialog .p-dialog-content {
    @apply p-4; /* Adjust content padding */
}
.p-dialog .p-dialog-footer {
    @apply border-t border-border p-4 flex justify-end gap-2; /* Adjust footer padding */
}

/* Adjust SelectButton */
.p-selectbutton .p-button {
    @apply h-10 px-3 border border-input focus:ring-1; /* Consistent height and border */
}
.p-selectbutton .p-button.p-highlight {
    @apply bg-primary text-primary-foreground border-primary;
}
.p-selectbutton .p-button:not(.p-highlight):hover {
    @apply bg-accent text-accent-foreground border-accent;
}

</style>

