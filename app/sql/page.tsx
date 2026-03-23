"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Search, Database, Table, GitMerge, Layers, BarChart3, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface SQLExample {
  name: string
  description: string
  sql: string
}

interface SQLCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
  examples: SQLExample[]
}

const sqlCategories: SQLCategory[] = [
  {
    id: "select",
    name: "SELECT",
    icon: Database,
    color: "text-blue-400",
    examples: [
      { name: "Basic SELECT", description: "Select all columns", sql: "SELECT * FROM users;" },
      { name: "Select Columns", description: "Select specific columns", sql: "SELECT name, email FROM users;" },
      { name: "WHERE Clause", description: "Filter results", sql: "SELECT * FROM users\nWHERE status = 'active';" },
      { name: "ORDER BY", description: "Sort results", sql: "SELECT * FROM users\nORDER BY created_at DESC;" },
      { name: "LIMIT & OFFSET", description: "Pagination", sql: "SELECT * FROM users\nLIMIT 10 OFFSET 20;" },
      { name: "DISTINCT", description: "Unique values only", sql: "SELECT DISTINCT country FROM users;" },
      { name: "Aliases", description: "Rename columns", sql: "SELECT \n  first_name AS name,\n  email AS contact\nFROM users;" },
      { name: "LIKE Pattern", description: "Pattern matching", sql: "SELECT * FROM users\nWHERE email LIKE '%@gmail.com';" },
      { name: "IN Clause", description: "Match multiple values", sql: "SELECT * FROM users\nWHERE status IN ('active', 'pending');" },
      { name: "BETWEEN", description: "Range filtering", sql: "SELECT * FROM orders\nWHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';" },
      { name: "IS NULL / IS NOT NULL", description: "Check for null values", sql: "SELECT * FROM users\nWHERE deleted_at IS NULL;" },
      { name: "CASE Expression", description: "Conditional logic", sql: "SELECT name,\n  CASE \n    WHEN age < 18 THEN 'minor'\n    WHEN age < 65 THEN 'adult'\n    ELSE 'senior'\n  END AS age_group\nFROM users;" },
    ]
  },
  {
    id: "joins",
    name: "JOINs",
    icon: GitMerge,
    color: "text-green-400",
    examples: [
      { name: "INNER JOIN", description: "Match in both tables", sql: "SELECT u.name, o.total\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;" },
      { name: "LEFT JOIN", description: "All from left, matched from right", sql: "SELECT u.name, o.total\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;" },
      { name: "RIGHT JOIN", description: "All from right, matched from left", sql: "SELECT u.name, o.total\nFROM users u\nRIGHT JOIN orders o ON u.id = o.user_id;" },
      { name: "FULL OUTER JOIN", description: "All from both tables", sql: "SELECT u.name, o.total\nFROM users u\nFULL OUTER JOIN orders o ON u.id = o.user_id;" },
      { name: "Self JOIN", description: "Join table to itself", sql: "SELECT e.name, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;" },
      { name: "Multiple JOINs", description: "Join multiple tables", sql: "SELECT u.name, o.total, p.name AS product\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN products p ON o.product_id = p.id;" },
      { name: "CROSS JOIN", description: "Cartesian product", sql: "SELECT colors.name, sizes.name\nFROM colors\nCROSS JOIN sizes;" },
    ]
  },
  {
    id: "groupby",
    name: "GROUP BY",
    icon: Layers,
    color: "text-amber-400",
    examples: [
      { name: "Basic GROUP BY", description: "Group and count", sql: "SELECT country, COUNT(*) AS total\nFROM users\nGROUP BY country;" },
      { name: "SUM Aggregation", description: "Sum values by group", sql: "SELECT user_id, SUM(total) AS revenue\nFROM orders\nGROUP BY user_id;" },
      { name: "AVG Aggregation", description: "Average by group", sql: "SELECT category, AVG(price) AS avg_price\nFROM products\nGROUP BY category;" },
      { name: "HAVING Clause", description: "Filter groups", sql: "SELECT country, COUNT(*) AS total\nFROM users\nGROUP BY country\nHAVING COUNT(*) > 100;" },
      { name: "Multiple Columns", description: "Group by multiple", sql: "SELECT country, city, COUNT(*)\nFROM users\nGROUP BY country, city;" },
      { name: "MIN/MAX", description: "Find extremes", sql: "SELECT category,\n  MIN(price) AS cheapest,\n  MAX(price) AS expensive\nFROM products\nGROUP BY category;" },
      { name: "GROUP BY with ORDER", description: "Sort grouped results", sql: "SELECT category, SUM(sales) AS total\nFROM products\nGROUP BY category\nORDER BY total DESC;" },
    ]
  },
  {
    id: "window",
    name: "Window Functions",
    icon: BarChart3,
    color: "text-purple-400",
    examples: [
      { name: "ROW_NUMBER", description: "Sequential row numbers", sql: "SELECT name, salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank\nFROM employees;" },
      { name: "RANK", description: "Rank with gaps", sql: "SELECT name, score,\n  RANK() OVER (ORDER BY score DESC) AS rank\nFROM students;" },
      { name: "DENSE_RANK", description: "Rank without gaps", sql: "SELECT name, score,\n  DENSE_RANK() OVER (ORDER BY score DESC) AS rank\nFROM students;" },
      { name: "PARTITION BY", description: "Window per group", sql: "SELECT department, name, salary,\n  RANK() OVER (\n    PARTITION BY department \n    ORDER BY salary DESC\n  ) AS dept_rank\nFROM employees;" },
      { name: "Running Total", description: "Cumulative sum", sql: "SELECT date, amount,\n  SUM(amount) OVER (\n    ORDER BY date\n    ROWS UNBOUNDED PRECEDING\n  ) AS running_total\nFROM transactions;" },
      { name: "LAG", description: "Previous row value", sql: "SELECT date, price,\n  LAG(price, 1) OVER (ORDER BY date) AS prev_price,\n  price - LAG(price, 1) OVER (ORDER BY date) AS change\nFROM stocks;" },
      { name: "LEAD", description: "Next row value", sql: "SELECT date, price,\n  LEAD(price, 1) OVER (ORDER BY date) AS next_price\nFROM stocks;" },
      { name: "Moving Average", description: "3-day moving average", sql: "SELECT date, price,\n  AVG(price) OVER (\n    ORDER BY date\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS moving_avg\nFROM stocks;" },
      { name: "FIRST_VALUE / LAST_VALUE", description: "First or last in window", sql: "SELECT name, department, salary,\n  FIRST_VALUE(name) OVER (\n    PARTITION BY department \n    ORDER BY salary DESC\n  ) AS top_earner\nFROM employees;" },
    ]
  },
  {
    id: "indexes",
    name: "Indexes",
    icon: Zap,
    color: "text-rose-400",
    examples: [
      { name: "Create Index", description: "Basic index", sql: "CREATE INDEX idx_users_email\nON users (email);" },
      { name: "Unique Index", description: "Enforce uniqueness", sql: "CREATE UNIQUE INDEX idx_users_email\nON users (email);" },
      { name: "Composite Index", description: "Multi-column index", sql: "CREATE INDEX idx_orders_user_date\nON orders (user_id, created_at);" },
      { name: "Partial Index", description: "Conditional index (PostgreSQL)", sql: "CREATE INDEX idx_active_users\nON users (email)\nWHERE status = 'active';" },
      { name: "Drop Index", description: "Remove index", sql: "DROP INDEX idx_users_email;" },
      { name: "Show Indexes", description: "List table indexes (MySQL)", sql: "SHOW INDEX FROM users;" },
      { name: "Analyze Query", description: "Explain query plan", sql: "EXPLAIN ANALYZE\nSELECT * FROM users\nWHERE email = 'test@example.com';" },
    ]
  },
  {
    id: "common",
    name: "Common Patterns",
    icon: Table,
    color: "text-cyan-400",
    examples: [
      { name: "INSERT", description: "Add new row", sql: "INSERT INTO users (name, email)\nVALUES ('John', 'john@example.com');" },
      { name: "INSERT Multiple", description: "Add multiple rows", sql: "INSERT INTO users (name, email)\nVALUES \n  ('John', 'john@example.com'),\n  ('Jane', 'jane@example.com');" },
      { name: "UPDATE", description: "Modify existing rows", sql: "UPDATE users\nSET status = 'active'\nWHERE id = 1;" },
      { name: "DELETE", description: "Remove rows", sql: "DELETE FROM users\nWHERE status = 'deleted';" },
      { name: "UPSERT (PostgreSQL)", description: "Insert or update", sql: "INSERT INTO users (id, name, email)\nVALUES (1, 'John', 'john@example.com')\nON CONFLICT (id) DO UPDATE\nSET name = EXCLUDED.name,\n    email = EXCLUDED.email;" },
      { name: "UPSERT (MySQL)", description: "Insert or update", sql: "INSERT INTO users (id, name, email)\nVALUES (1, 'John', 'john@example.com')\nON DUPLICATE KEY UPDATE\n  name = VALUES(name),\n  email = VALUES(email);" },
      { name: "CTE (Common Table Expression)", description: "Named subquery", sql: "WITH active_users AS (\n  SELECT * FROM users\n  WHERE status = 'active'\n)\nSELECT * FROM active_users\nWHERE created_at > '2024-01-01';" },
      { name: "Recursive CTE", description: "Hierarchical data", sql: "WITH RECURSIVE tree AS (\n  SELECT id, name, parent_id, 1 AS level\n  FROM categories\n  WHERE parent_id IS NULL\n  UNION ALL\n  SELECT c.id, c.name, c.parent_id, t.level + 1\n  FROM categories c\n  JOIN tree t ON c.parent_id = t.id\n)\nSELECT * FROM tree;" },
      { name: "Subquery in WHERE", description: "Nested query filter", sql: "SELECT * FROM users\nWHERE id IN (\n  SELECT user_id FROM orders\n  WHERE total > 100\n);" },
      { name: "Correlated Subquery", description: "Subquery referencing outer", sql: "SELECT u.name,\n  (SELECT COUNT(*) FROM orders o\n   WHERE o.user_id = u.id) AS order_count\nFROM users u;" },
      { name: "COALESCE", description: "Default for null", sql: "SELECT name,\n  COALESCE(phone, email, 'N/A') AS contact\nFROM users;" },
      { name: "String Concatenation", description: "Combine strings", sql: "SELECT \n  first_name || ' ' || last_name AS full_name\nFROM users;\n-- MySQL: CONCAT(first_name, ' ', last_name)" },
    ]
  }
]

export default function SQLPage() {
  const [search, setSearch] = useState("")
  const [copiedSql, setCopiedSql] = useState<string | null>(null)

  const copyToClipboard = async (sql: string) => {
    await navigator.clipboard.writeText(sql)
    setCopiedSql(sql)
    setTimeout(() => setCopiedSql(null), 2000)
  }

  const filterExamples = (examples: SQLExample[]) => {
    if (!search) return examples
    return examples.filter(ex =>
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.description.toLowerCase().includes(search.toLowerCase()) ||
      ex.sql.toLowerCase().includes(search.toLowerCase())
    )
  }

  return (
    <ToolLayout
      title="SQL Cheatsheet"
      description="SELECT, JOINs, GROUP BY, window functions, indexes, and common patterns"
    >
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search SQL queries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="select">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-secondary p-1">
            {sqlCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="flex items-center gap-1.5 text-xs"
              >
                <cat.icon className={cn("h-3.5 w-3.5", cat.color)} />
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {sqlCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {filterExamples(category.examples).map((example) => (
                  <Card key={example.name} className="border-border bg-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-foreground">{example.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(example.sql)}
                          className="h-7"
                        >
                          {copiedSql === example.sql ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{example.description}</p>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs font-mono bg-secondary p-3 rounded-lg overflow-x-auto text-foreground whitespace-pre">
                        {example.sql}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ToolLayout>
  )
}
