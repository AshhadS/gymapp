'use client'; // Needed for charts and client-side interactions

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, LabelList } from 'recharts';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, Target, PlusCircle, Utensils, Home, ShoppingCart, Film, Bus } from 'lucide-react';

// Define types
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

// Dummy Data
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

const expenseCategories = [
    { value: 'Groceries', label: 'Groceries', icon: Utensils },
    { value: 'Rent', label: 'Rent', icon: Home },
    { value: 'Shopping', label: 'Shopping', icon: ShoppingCart },
    { value: 'Entertainment', label: 'Entertainment', icon: Film },
    { value: 'Transport', label: 'Transport', icon: Bus },
    { value: 'Other', label: 'Other', icon: DollarSign },
];

const incomeCategories = [
    { value: 'Salary', label: 'Salary', icon: DollarSign },
    { value: 'Freelance', label: 'Freelance', icon: DollarSign },
    { value: 'Investment', label: 'Investment', icon: TrendingUp },
    { value: 'Other', label: 'Other', icon: DollarSign },
]


// Chart Configs
const barChartConfig = {
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-1))',
  },
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const pieChartConfig = {
  Groceries: { label: 'Groceries', color: 'hsl(var(--chart-1))' },
  Rent: { label: 'Rent', color: 'hsl(var(--chart-2))' },
  Entertainment: { label: 'Entertainment', color: 'hsl(var(--chart-3))' },
  Transport: { label: 'Transport', color: 'hsl(var(--chart-4))' },
  Shopping: { label: 'Shopping', color: 'hsl(var(--chart-5))' },
  Other: { label: 'Other', color: 'hsl(var(--muted))' },
} satisfies ChartConfig;


// Helper Functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getCategoryIcon = (category: string) => {
  const cat = [...expenseCategories, ...incomeCategories].find(c => c.value === category);
  return cat ? cat.icon : DollarSign;
}

export default function BudgetFlowDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(initialBudgetGoals);
  const [newTransactionType, setNewTransactionType] = useState<'income' | 'expense'>('expense');
  const [newTransactionCategory, setNewTransactionCategory] = useState<string>('');
  const [newTransactionAmount, setNewTransactionAmount] = useState<string>('');
  const [newGoalCategory, setNewGoalCategory] = useState<string>('');
  const [newGoalLimit, setNewGoalLimit] = useState<string>('');
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const { toast } = useToast();


  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netBalance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const expensesByCategory = useMemo(() => {
    const expensesMap = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expensesMap.set(t.category, (expensesMap.get(t.category) || 0) + t.amount);
      });
    return Array.from(expensesMap, ([category, amount]) => ({ category, amount }));
  }, [transactions]);

  const incomeExpenseData = useMemo(() => {
      // Example: Aggregate by month (simplified for this example)
      const monthlyData = new Map<string, { income: number; expenses: number }>();
      const currentMonth = new Date().toLocaleString('default', { month: 'short' }); // Very basic grouping

      transactions.forEach(t => {
          const data = monthlyData.get(currentMonth) ?? { income: 0, expenses: 0 };
          if (t.type === 'income') data.income += t.amount;
          else data.expenses += t.amount;
          monthlyData.set(currentMonth, data);
      });
      // Add more months if needed or available from data
       if (!monthlyData.has('Jun')) monthlyData.set('Jun', {income: 3800, expenses: 1800}); // Example past data
       if (!monthlyData.has('May')) monthlyData.set('May', {income: 3600, expenses: 1950}); // Example past data

      return Array.from(monthlyData, ([month, data]) => ({ month, ...data })).sort((a, b) => {
            const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
        });

  }, [transactions]);


  const handleAddTransaction = () => {
    const amount = parseFloat(newTransactionAmount);
    if (!newTransactionCategory || isNaN(amount) || amount <= 0) {
        toast({
            title: 'Invalid Input',
            description: 'Please select a category and enter a valid positive amount.',
            variant: 'destructive',
        });
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: newTransactionType,
      category: newTransactionCategory,
      amount: amount,
      date: new Date().toISOString(),
    };

    setTransactions([...transactions, newTransaction]);
    toast({
        title: 'Transaction Added',
        description: `${formatCurrency(amount)} ${newTransactionType === 'income' ? 'income' : 'expense'} recorded for ${newTransactionCategory}.`,
    });

    // Reset form and close dialog
    setNewTransactionCategory('');
    setNewTransactionAmount('');
    setIsTransactionDialogOpen(false);
  };

  const handleAddBudgetGoal = () => {
     const limit = parseFloat(newGoalLimit);
    if (!newGoalCategory || isNaN(limit) || limit <= 0) {
        toast({
            title: 'Invalid Input',
            description: 'Please select a category and enter a valid positive limit.',
            variant: 'destructive',
        });
      return;
    }

    // Check if goal for category already exists
    const existingGoalIndex = budgetGoals.findIndex(g => g.category === newGoalCategory);

    const newGoal: BudgetGoal = {
      id: crypto.randomUUID(),
      category: newGoalCategory,
      limit: limit,
    };

    if (existingGoalIndex > -1) {
        // Update existing goal
        const updatedGoals = [...budgetGoals];
        updatedGoals[existingGoalIndex] = { ...updatedGoals[existingGoalIndex], limit: limit };
        setBudgetGoals(updatedGoals);
        toast({
            title: 'Budget Goal Updated',
            description: `Budget for ${newGoalCategory} set to ${formatCurrency(limit)}.`,
        });
    } else {
        // Add new goal
        setBudgetGoals([...budgetGoals, newGoal]);
        toast({
            title: 'Budget Goal Added',
            description: `Budget for ${newGoalCategory} set to ${formatCurrency(limit)}.`,
        });
    }


    // Reset form and close dialog
    setNewGoalCategory('');
    setNewGoalLimit('');
    setIsGoalDialogOpen(false);
  };

  const getSpentAmount = (category: string) => {
    return transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
  }

  return (
    <div className="w-full max-w-6xl space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">BudgetFlow Dashboard</h1>
         <div className="flex gap-2">
             {/* Add Transaction Dialog */}
            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Transaction</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>
                    Record your income or expense. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                         <Select value={newTransactionType} onValueChange={(value) => setNewTransactionType(value as 'income' | 'expense')}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                     <Select value={newTransactionCategory} onValueChange={setNewTransactionCategory}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {newTransactionType === 'expense' ? expenseCategories.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    <span className="flex items-center"><cat.icon className="mr-2 h-4 w-4 text-muted-foreground" />{cat.label}</span>
                                </SelectItem>
                            )) : incomeCategories.map(cat => (
                                 <SelectItem key={cat.value} value={cat.value}>
                                     <span className="flex items-center"><cat.icon className="mr-2 h-4 w-4 text-muted-foreground" />{cat.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount ($)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newTransactionAmount}
                      onChange={(e) => setNewTransactionAmount(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., 50.00"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                  <Button type="button" onClick={handleAddTransaction}>Save Transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

             {/* Add Budget Goal Dialog */}
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline"><Target className="mr-2 h-4 w-4" /> Set Budget Goal</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Set Budget Goal</DialogTitle>
                  <DialogDescription>
                    Set a spending limit for a specific category.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goal-category" className="text-right">
                      Category
                    </Label>
                     <Select value={newGoalCategory} onValueChange={setNewGoalCategory}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {expenseCategories.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                     <span className="flex items-center"><cat.icon className="mr-2 h-4 w-4 text-muted-foreground" />{cat.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goal-limit" className="text-right">
                      Limit ($)
                    </Label>
                    <Input
                      id="goal-limit"
                      type="number"
                      value={newGoalLimit}
                      onChange={(e) => setNewGoalLimit(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., 400.00"
                       min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                  <Button type="button" onClick={handleAddBudgetGoal}>Save Goal</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
         </div>
      </header>

      {/* Key Insights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-accent-foreground' : 'text-destructive'}`}>{formatCurrency(netBalance)}</div>
            <p className="text-xs text-muted-foreground">Remaining balance</p>
          </CardContent>
        </Card>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={incomeExpenseData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                 {/* <YAxis /> */}
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
             <CardDescription>Spending by category this month</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-[250px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="amount" hideLabel />} />
                <Pie
                    data={expensesByCategory}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={60}
                    strokeWidth={5}
                >
                     <LabelList
                        dataKey="category"
                        className="fill-background"
                        stroke="none"
                        fontSize={12}
                        formatter={(value: string) => pieChartConfig[value as keyof typeof pieChartConfig]?.label}
                    />
                    {expensesByCategory.map((entry) => (
                        <Cell key={entry.category} fill={pieChartConfig[entry.category as keyof typeof pieChartConfig]?.color || pieChartConfig['Other'].color} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* Budget Goals */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Budget Goals</CardTitle>
            <CardDescription>Track your spending against your set limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetGoals.length === 0 && <p className="text-muted-foreground text-center">No budget goals set yet. Click 'Set Budget Goal' to add one.</p>}
            {budgetGoals.map((goal) => {
              const spent = getSpentAmount(goal.category);
              const remaining = goal.limit - spent;
              const progress = Math.min((spent / goal.limit) * 100, 100);
              const Icon = getCategoryIcon(goal.category);
              return (
                <div key={goal.id} className="space-y-1">
                    <div className="flex justify-between items-center text-sm font-medium">
                       <span className="flex items-center gap-2"> <Icon className="h-4 w-4 text-muted-foreground" /> {goal.category}</span>
                       <span>{formatCurrency(spent)} / {formatCurrency(goal.limit)}</span>
                    </div>
                  <Progress value={progress} aria-label={`${goal.category} budget progress`} className={`${progress >= 100 ? '[&>div]:bg-destructive' : progress > 75 ? '[&>div]:bg-orange-500' : '[&>div]:bg-accent'}`}/>
                  <p className={`text-xs ${remaining >= 0 ? 'text-muted-foreground' : 'text-destructive font-medium'}`}>
                     {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over budget`}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* Recent Transactions */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
             <CardDescription>Your latest income and expenses.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">No transactions yet.</TableCell>
                        </TableRow>
                    )}
                    {transactions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort newest first
                        .slice(0, 5) // Show latest 5
                        .map((transaction) => {
                            const Icon = getCategoryIcon(transaction.category);
                            return (
                                <TableRow key={transaction.id}>
                                <TableCell className="font-medium">
                                    <span className={`capitalize ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {transaction.type}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" />{transaction.category}</span>
                                </TableCell>
                                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                </TableCell>
                                </TableRow>
                            );
                    })}
                </TableBody>
                </Table>
          </CardContent>
           {transactions.length > 5 && (
                <CardFooter className="justify-center">
                    {/* Placeholder for a "View All" button or link */}
                    <Button variant="link" size="sm">View All Transactions</Button>
                </CardFooter>
            )}
        </Card>
      </section>
    </div>
  );
}
