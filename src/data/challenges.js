// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  JaDev Academy â€” Code Challenges
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const CHALLENGES = [
  {
    id: 'ch-01',
    title: 'FizzBuzz â€” C# Style',
    track: 'csharp',
    difficulty: 'Beginner',
    timeLimit: 10,
    description: `Write a method that returns "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, and the number itself otherwise. Use a switch expression.`,
    starterCode: `public static string FizzBuzz(int n)
{
    // Your code here
    // Use a switch expression with when guards
}`,
    solution: `public static string FizzBuzz(int n) => (n % 3, n % 5) switch
{
    (0, 0) => "FizzBuzz",
    (0, _) => "Fizz",
    (_, 0) => "Buzz",
    _      => n.ToString()
};`,
    hints: [
      'Use a tuple switch expression on (n % 3, n % 5)',
      'Check (0,0) first â€” it matches both conditions',
      'Use _ as wildcard for "anything else"'
    ],
    testCases: [
      { input: '15', expected: '"FizzBuzz"', description: 'Multiple of both 3 and 5' },
      { input: '9',  expected: '"Fizz"',     description: 'Multiple of 3 only' },
      { input: '10', expected: '"Buzz"',     description: 'Multiple of 5 only' },
      { input: '7',  expected: '"7"',        description: 'Not a multiple of either' },
    ],
    concepts: ['switch expression', 'tuple deconstruction', 'pattern matching']
  },
  {
    id: 'ch-02',
    title: 'LINQ: Top Earners by Department',
    track: 'csharp',
    difficulty: 'Intermediate',
    timeLimit: 15,
    description: `Given a list of employees, return the highest-paid employee in each department as a Dictionary<string, string> (department â†’ employee name). Use LINQ.`,
    starterCode: `record Employee(string Name, string Department, decimal Salary);

public static Dictionary<string, string> TopEarnerByDept(List<Employee> employees)
{
    // Your LINQ query here
}`,
    solution: `public static Dictionary<string, string> TopEarnerByDept(List<Employee> employees)
{
    return employees
        .GroupBy(e => e.Department)
        .ToDictionary(
            g => g.Key,
            g => g.MaxBy(e => e.Salary)!.Name
        );
}`,
    hints: [
      'Use GroupBy() to group employees by department',
      'On each group, use MaxBy() to find the employee with the highest salary',
      'ToDictionary() can project the key and value'
    ],
    testCases: [
      { input: 'Engineering: Alice(100k), Bob(90k), HR: Carol(75k)', expected: '{ Engineering: "Alice", HR: "Carol" }', description: 'Two departments' },
    ],
    concepts: ['GroupBy', 'MaxBy', 'ToDictionary', 'LINQ projection']
  },
  {
    id: 'ch-03',
    title: 'Async Retry with Exponential Backoff',
    track: 'csharp',
    difficulty: 'Advanced',
    timeLimit: 20,
    description: `Implement a generic retry helper that retries an async operation up to maxRetries times with exponential backoff (1s, 2s, 4s...). Throw the last exception if all retries fail.`,
    starterCode: `public static async Task<T> RetryAsync<T>(
    Func<Task<T>> operation,
    int maxRetries = 3,
    CancellationToken ct = default)
{
    // Your implementation here
}`,
    solution: `public static async Task<T> RetryAsync<T>(
    Func<Task<T>> operation,
    int maxRetries = 3,
    CancellationToken ct = default)
{
    Exception? lastException = null;
    for (int attempt = 0; attempt < maxRetries; attempt++)
    {
        try
        {
            return await operation();
        }
        catch (Exception ex) when (attempt < maxRetries - 1)
        {
            lastException = ex;
            var delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));
            await Task.Delay(delay, ct);
        }
    }
    throw lastException!;
}`,
    hints: [
      'Use a for loop from 0 to maxRetries',
      'Exponential backoff = Math.Pow(2, attemptNumber) seconds',
      'Use exception filter when() to only retry on non-final attempts',
      'Rethrow the last exception after all retries are exhausted'
    ],
    testCases: [
      { input: 'Operation fails 2 times, succeeds on 3rd', expected: 'Returns value on 3rd attempt', description: 'Basic retry' },
      { input: 'Operation always fails', expected: 'Throws exception after maxRetries', description: 'All retries exhausted' },
    ],
    concepts: ['async/await', 'generics', 'exponential backoff', 'exception handling']
  },
  {
    id: 'ch-04',
    title: 'React Custom Hook: useDebounce',
    track: 'react',
    difficulty: 'Intermediate',
    timeLimit: 15,
    description: `Implement a useDebounce hook that returns a debounced version of the given value, updating only after the specified delay has passed without changes.`,
    starterCode: `import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  // Your implementation here
  // Return the debounced value
}`,
    solution: `import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
    hints: [
      'Store the debounced value in useState',
      'Use useEffect with value and delay in dependencies',
      'Return a cleanup function that clears the timeout',
      'The key: each time value changes, the previous timer is cancelled'
    ],
    testCases: [
      { input: 'Type "hello" quickly', expected: 'Debounced value updates only after 300ms of silence', description: 'Normal debounce' },
      { input: 'Stop typing', expected: 'Value updates after delay', description: 'Update on pause' },
    ],
    concepts: ['custom hooks', 'useEffect cleanup', 'debouncing', 'timers']
  },
  {
    id: 'ch-05',
    title: 'Reverse a Linked List',
    track: 'oop',
    difficulty: 'Intermediate',
    timeLimit: 20,
    description: `Implement a method to reverse a singly linked list in-place and return the new head. The ListNode class has Value (int) and Next (ListNode?) properties.`,
    starterCode: `public class ListNode
{
    public int Value { get; set; }
    public ListNode? Next { get; set; }
    public ListNode(int val) => Value = val;
}

public static ListNode? ReverseList(ListNode? head)
{
    // Your implementation here
}`,
    solution: `public static ListNode? ReverseList(ListNode? head)
{
    ListNode? prev = null;
    ListNode? current = head;

    while (current != null)
    {
        ListNode? next = current.Next;   // save next
        current.Next = prev;             // reverse pointer
        prev = current;                  // advance prev
        current = next;                  // advance current
    }

    return prev;   // prev is now the new head
}`,
    hints: [
      'Use three pointers: prev (starts null), current (starts at head), next (temp)',
      'Save current.Next before overwriting it',
      'In each iteration: flip the pointer, then advance both prev and current',
      'When current is null, prev is the new head'
    ],
    testCases: [
      { input: '1 â†’ 2 â†’ 3 â†’ 4 â†’ 5', expected: '5 â†’ 4 â†’ 3 â†’ 2 â†’ 1', description: 'Standard reversal' },
      { input: '1 â†’ 2', expected: '2 â†’ 1', description: 'Two elements' },
      { input: 'null', expected: 'null', description: 'Empty list' },
    ],
    concepts: ['linked list', 'pointer manipulation', 'iterative algorithm']
  },
  {
    id: 'ch-06',
    title: 'REST API: Design a Product Endpoint',
    track: 'apis',
    difficulty: 'Beginner',
    timeLimit: 10,
    description: `Design the URL structure and HTTP method for a products API. Match each operation to the correct method and URL.`,
    starterCode: `// Match each operation to: METHOD /url

// Operations:
// 1. Get all products
// 2. Get product by ID (id=5)
// 3. Create a new product
// 4. Update entire product (id=5)
// 5. Partially update product price (id=5)
// 6. Delete product (id=5)
// 7. Get all reviews for product (id=5)

// Your answers:
// 1:
// 2:
// 3:
// 4:
// 5:
// 6:
// 7: `,
    solution: `// Correct REST API design:

// 1. Get all products
GET /api/products

// 2. Get product by ID (id=5)
GET /api/products/5

// 3. Create a new product
POST /api/products

// 4. Update entire product (id=5)
PUT /api/products/5

// 5. Partially update product price (id=5)
PATCH /api/products/5

// 6. Delete product (id=5)
DELETE /api/products/5

// 7. Get all reviews for product (id=5)
GET /api/products/5/reviews`,
    hints: [
      'Use plural nouns for resource names: /products not /product',
      'PUT replaces the whole resource; PATCH updates specific fields',
      'Nested resources: /products/{id}/reviews',
      'Never put verbs in URLs: not /getProduct or /deleteProduct'
    ],
    testCases: [],
    concepts: ['REST URLs', 'HTTP methods', 'resource naming', 'nested resources']
  },
  {
    id: 'ch-07',
    title: 'Implement the Strategy Pattern',
    track: 'oop',
    difficulty: 'Advanced',
    timeLimit: 25,
    description: `Implement a discount calculator using the Strategy pattern. Support three strategies: NoDiscount (0%), SilverDiscount (10%), GoldDiscount (20%). Use dependency injection.`,
    starterCode: `// Define the interface and three strategies
// Then implement OrderService that uses the strategy

public interface IDiscountStrategy
{
    // Your code here
}

public class OrderService
{
    // Your code here
}`,
    solution: `public interface IDiscountStrategy
{
    decimal ApplyDiscount(decimal originalPrice);
    string Name { get; }
}

public class NoDiscount : IDiscountStrategy
{
    public string Name => "Standard";
    public decimal ApplyDiscount(decimal price) => price;
}

public class SilverDiscount : IDiscountStrategy
{
    public string Name => "Silver (10% off)";
    public decimal ApplyDiscount(decimal price) => price * 0.90m;
}

public class GoldDiscount : IDiscountStrategy
{
    public string Name => "Gold (20% off)";
    public decimal ApplyDiscount(decimal price) => price * 0.80m;
}

public class OrderService
{
    private readonly IDiscountStrategy _discount;

    public OrderService(IDiscountStrategy discount) => _discount = discount;

    public decimal CalculateTotal(decimal originalPrice)
    {
        var discounted = _discount.ApplyDiscount(originalPrice);
        Console.WriteLine($"Applied {_discount.Name}: {originalPrice:C} â†’ {discounted:C}");
        return discounted;
    }
}

// Usage:
// var service = new OrderService(new GoldDiscount());
// service.CalculateTotal(100m);  // â†’ $80.00`,
    hints: [
      'Define IDiscountStrategy with ApplyDiscount(decimal) and a Name property',
      'Each strategy class implements the interface differently',
      'OrderService takes IDiscountStrategy in its constructor (DIP)',
      'To add a new discount type, create a new class â€” don\'t touch OrderService'
    ],
    testCases: [
      { input: 'GoldDiscount on $100', expected: '$80.00', description: '20% off' },
      { input: 'SilverDiscount on $100', expected: '$90.00', description: '10% off' },
      { input: 'NoDiscount on $100', expected: '$100.00', description: 'No change' },
    ],
    concepts: ['Strategy pattern', 'OCP', 'DIP', 'polymorphism', 'dependency injection']
  },
  {
    id: 'ch-08',
    title: 'Clean Code: Refactor This Method',
    track: 'refactoring',
    difficulty: 'Intermediate',
    timeLimit: 20,
    description: `Identify and fix all the code smells in the following method. Rename variables, extract methods, use proper patterns.`,
    starterCode: `// Smell-ridden code â€” refactor it!
public string DoStuff(List<int> d, string t, bool f)
{
    int x = 0;
    for(int i = 0; i < d.Count; i++)
    {
        if(f == true)
        {
            if(d[i] > 0)
            {
                x = x + d[i];
            }
        }
        else
        {
            x = x + d[i];
        }
    }
    if(t == "USD") { return "$" + x.ToString(); }
    else if(t == "EUR") { return "â‚¬" + x.ToString(); }
    else { return x.ToString() + " " + t; }
}`,
    solution: `// Refactored â€” clean version
public string CalculateTotalPrice(
    List<int> prices,
    string currency,
    bool excludeNegative = false)
{
    var validPrices  = excludeNegative ? prices.Where(p => p > 0) : prices;
    var total        = validPrices.Sum();
    return FormatCurrency(total, currency);
}

private string FormatCurrency(int amount, string currency) => currency switch
{
    "USD" => "$" + amount,
    "EUR" => "€" + amount,
    _     => amount + " " + currency
};

// Improvements:
// 1. Descriptive parameter names: dâ†’prices, tâ†’currency, fâ†’excludeNegative
// 2. Replaced manual loop with LINQ: .Where().Sum()
// 3. Removed redundant "== true"
// 4. Extracted FormatCurrency into its own method (SRP)
// 5. Used switch expression instead of if/else chain`,
    hints: [
      'Rename: dâ†’prices, tâ†’currency, fâ†’excludeNegative',
      'Replace the for loop with LINQ: .Where(p => p > 0).Sum()',
      'Remove the redundant "== true" comparison',
      'Extract formatting logic into a separate method',
      'Use switch expression for currency formatting'
    ],
    testCases: [
      { input: '[1,2,-3,4], "USD", true', expected: '"$7"', description: 'Exclude negatives, USD' },
      { input: '[10,20], "EUR", false', expected: '"â‚¬30"', description: 'Include all, EUR' },
    ],
    concepts: ['naming', 'LINQ', 'extract method', 'switch expression', 'clean code']
  },
];

export const getChallengeById = (id) => CHALLENGES.find(c => c.id === id);
export const getChallengesByTrack = (trackId) => CHALLENGES.filter(c => c.track === trackId);
