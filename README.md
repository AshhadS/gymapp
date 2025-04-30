# BudgetFlow (Vue 3 Version)

This is a budgeting and expense tracking app built with Vue 3, Vite, Pinia, PrimeVue, Tailwind CSS, and Chart.js.

## Project Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The app will be available at `http://localhost:9002`.

3.  **Compile and Minify for Production:**
    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    ```

4.  **Lint with [ESLint](https://eslint.org/):**
    ```bash
    npm run lint
    # or
    yarn lint
    # or
    pnpm lint
    ```

5.  **Type Check with [Vue TSC](https://github.com/vuejs/language-tools/tree/master/packages/vue-tsc):**
    ```bash
    npm run typecheck
    # or
    yarn typecheck
    # or
    pnpm typecheck
    ```

## Features

-   Expense Tracking: Manually input income and expenses with categories.
-   Data Visualization: Interactive bar and pie charts for spending analysis.
-   Budget Goals: Set and track monthly budget goals per category.
-   Clean Dashboard: Key financial insights at a glance.

## Tech Stack

-   Vue 3 (Composition API)
-   Vite
-   Pinia (for state management, though not heavily used in this version yet)
-   PrimeVue (for UI components like Dialogs, DataTable, ProgressBar, etc.)
-   Tailwind CSS (for utility-first styling)
-   Chart.js & vue-chartjs (for charts)
-   Lucide Icons (via `lucide-vue-next`)
-   TypeScript

## Customization

-   **Styling:** Modify `src/assets/main.css` for global styles and theme variables. Tailwind utility classes are used directly in components. PrimeVue components are styled using Tailwind classes where possible and some targeted CSS in `DashboardView.vue`.
-   **Theme:** The color scheme is defined using CSS HSL variables in `src/assets/main.css`, matching the original Next.js theme. PrimeVue theme preset (Aura) is used as a base.
